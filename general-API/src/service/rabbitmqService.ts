import * as amqp from "amqplib";
import {ChannelModel} from "amqplib";
import {Channel} from "node:diagnostics_channel";

class RabbitMQService {
    private connection: ChannelModel | null = null;
    private channel: amqp.Channel | null = null;
    private connectionPromise: Promise<void> | null = null;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private readonly url: string;
    private consumers: Map<string, string> = new Map(); // Stocke les consumerTags par queueName

    constructor(url: string = 'amqp://localhost') {
        this.url = url;
    }

    async connect(): Promise<void> {
        if (this.connectionPromise) return this.connectionPromise;

        this.connectionPromise = new Promise(async (resolve, reject) => {
            try {
                console.log("🔌 Connecting to RabbitMQ...");
                this.connection = await amqp.connect(this.url);

                this.connection.on('error', (err) => {
                    console.error("❌ RabbitMQ connection error:", err);
                    this.scheduleReconnect();
                });

                this.connection.on('close', () => {
                    console.log("❌ RabbitMQ connection closed");
                    this.scheduleReconnect();
                });

                this.channel = await this.connection.createChannel();
                console.log("✅ Connected to RabbitMQ");
                resolve();
            } catch (error) {
                console.error("❌ Failed to connect to RabbitMQ:", error);
                this.connectionPromise = null;
                this.scheduleReconnect();
                reject(error);
            }
        });

        return this.connectionPromise;
    }

    private scheduleReconnect(): void {
        // Nettoyer les ressources existantes
        this.cleanup();

        // Programmer une nouvelle tentative de connexion
        if (!this.reconnectTimer) {
            this.reconnectTimer = setTimeout(async () => {
                this.reconnectTimer = null;
                this.connectionPromise = null;
                try {
                    await this.connect();
                    // Réenregistrer les consommateurs après la reconnexion
                    this.rebindConsumers();
                } catch (error) {
                    console.error("❌ Reconnection failed:", error);
                }
            }, 5000); // 5 secondes avant de tenter à nouveau
        }
    }

    private cleanup(): void {
        this.consumers.clear();

        if (this.channel) {
            try {
                this.channel.close();
            } catch (error) {
                console.error("Error closing channel:", error);
            }
            this.channel = null;
        }

        if (this.connection) {
            try {
                this.connection.close();
            } catch (error) {
                console.error("Error closing connection:", error);
            }
            this.connection = null;
        }
    }

    // Méthode pour réenregistrer les consommateurs après une reconnexion
    private async rebindConsumers(): Promise<void> {
        // Cette méthode serait implémentée si vous avez des consumers permanents
        // Pour ce cas d'utilisation, nous n'avons pas besoin de l'implémenter
    }

    async createQueue(queueName: string): Promise<void> {
        if (!this.channel) {
            await this.connect();
        }

        if (this.channel) {
            await this.channel.assertQueue(queueName, { durable: true });
            console.log(`✅ Queue ${queueName} created/confirmed`);
        }
    }

    async sendMessage(queueName: string, message: any): Promise<boolean> {
        if (!this.channel) {
            await this.connect();
        }

        if (!this.channel) {
            throw new Error("❌ RabbitMQ channel not available");
        }

        await this.createQueue(queueName);

        const messageBuffer = Buffer.from(JSON.stringify(message));
        const result = this.channel.sendToQueue(queueName, messageBuffer);
        console.log(`📤 Message sent to ${queueName}:`, message);
        return result;
    }

    async requestResponse(requestQueue: string, request: any, responseQueue: string, timeout = 10000): Promise<any> {
        if (!this.channel) {
            await this.connect();
        }

        if (!this.channel) {
            throw new Error("❌ RabbitMQ channel not available");
        }

        // Créer les deux queues
        await this.createQueue(requestQueue);
        await this.createQueue(responseQueue);

        // Générer un ID de corrélation unique pour cette requête
        const correlationId = Date.now().toString() + Math.random().toString(36).substring(2, 15);

        console.log(`📤 [${Date.now()}] Sending request to ${requestQueue} with correlationId: ${correlationId}`);

        // Attendre la réponse avant d'envoyer la requête
        const responsePromise = new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                // Si le consumerTag existe, annuler le consumer
                if (this.consumers.has(responseQueue)) {
                    const consumerTag = this.consumers.get(responseQueue);
                    if (consumerTag) {
                        this.channel?.cancel(consumerTag);
                        this.consumers.delete(responseQueue);
                    }
                }
                reject(new Error(`Timeout waiting for response on ${responseQueue} for request ${correlationId}`));
            }, timeout);

            this.channel!.consume(responseQueue, (msg) => {
                if (msg) {
                    // Accepter uniquement les messages avec notre correlationId
                    if (msg.properties.correlationId === correlationId) {
                        clearTimeout(timeoutId);

                        // Annuler le consommateur
                        if (this.consumers.has(responseQueue)) {
                            const consumerTag = this.consumers.get(responseQueue);
                            if (consumerTag) {
                                this.channel?.cancel(consumerTag).catch(err => {
                                    console.error(`Error canceling consumer: ${err}`);
                                });
                                this.consumers.delete(responseQueue);
                            }
                        }

                        // Acknowledge le message
                        this.channel?.ack(msg);

                        // Traiter la réponse
                        try {
                            const content = JSON.parse(msg.content.toString());
                            console.log(`📥 [${Date.now()}] Received response for request ${correlationId}:`, content);
                            resolve(content);
                        } catch (error) {
                            reject(new Error(`Failed to parse response message: ${error}`));
                        }
                    } else {
                        // Ce n'est pas notre message, le remettre dans la queue
                        this.channel?.nack(msg, false, true);
                    }
                }
            }, { noAck: false })
                .then(consumer => {
                    this.consumers.set(responseQueue, consumer.consumerTag);
                })
                .catch(error => {
                    clearTimeout(timeoutId);
                    reject(error);
                });
        });

        // Envoyer la requête avec l'ID de corrélation
        const messageBuffer = Buffer.from(JSON.stringify(request));
        this.channel.sendToQueue(requestQueue, messageBuffer, {
            correlationId: correlationId,
            replyTo: responseQueue
        });

        return responsePromise;
    }

    async close(): Promise<void> {
        if (this.channel) {
            await this.channel.close();
        }
        if (this.connection) {
            await this.connection.close();
        }
        this.channel = null;
        this.connection = null;
        this.connectionPromise = null;
        console.log("✅ RabbitMQ connection closed");
    }
}

export const rabbitMQService = new RabbitMQService();
