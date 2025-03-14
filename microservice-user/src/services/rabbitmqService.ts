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

    async consumeMessages(queueName: string, callback: (msg: any, properties: amqp.MessageProperties) => void) {
        if (!this.channel) {
            await this.connect();
        }

        if (!this.channel) {
            throw new Error("❌ RabbitMQ channel not available");
        }

        await this.createQueue(queueName);

        const { consumerTag } = await this.channel.consume(queueName, async (msg) => {
            if (msg) {
                console.log(`📥 [${Date.now()}] Message received on ${queueName} with correlationId: ${msg.properties.correlationId}`);

                try {
                    const content = JSON.parse(msg.content.toString());
                    callback(content, msg.properties);

                    this.channel?.ack(msg);
                } catch (error) {
                    console.error(`❌ [${Date.now()}] Error processing message:`, error);
                    this.channel?.nack(msg, false, true);
                }
            }
        }, { noAck: false });

        this.consumers.set(queueName, consumerTag);
        console.log(`👂 [${Date.now()}] Now listening on queue ${queueName}`);

        return consumerTag;
    }

    async sendMessage(queueName: string, message: any, properties: amqp.Options.Publish = {}): Promise<boolean> {
        if (!this.channel) {
            await this.connect();
        }

        if (!this.channel) {
            throw new Error("❌ RabbitMQ channel not available");
        }

        await this.createQueue(queueName);

        const messageBuffer = Buffer.from(JSON.stringify(message));
        return this.channel.sendToQueue(queueName, messageBuffer, properties);
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
