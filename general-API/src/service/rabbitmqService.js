"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rabbitMQService = void 0;
const amqp = __importStar(require("amqplib"));
class RabbitMQService {
    constructor(url = 'amqp://localhost') {
        this.connection = null;
        this.channel = null;
        this.connectionPromise = null;
        this.reconnectTimer = null;
        this.consumers = new Map(); // Stocke les consumerTags par queueName
        this.url = url;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connectionPromise)
                return this.connectionPromise;
            this.connectionPromise = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log("🔌 Connecting to RabbitMQ...");
                    this.connection = yield amqp.connect(this.url);
                    this.connection.on('error', (err) => {
                        console.error("❌ RabbitMQ connection error:", err);
                        this.scheduleReconnect();
                    });
                    this.connection.on('close', () => {
                        console.log("❌ RabbitMQ connection closed");
                        this.scheduleReconnect();
                    });
                    this.channel = yield this.connection.createChannel();
                    console.log("✅ Connected to RabbitMQ");
                    resolve();
                }
                catch (error) {
                    console.error("❌ Failed to connect to RabbitMQ:", error);
                    this.connectionPromise = null;
                    this.scheduleReconnect();
                    reject(error);
                }
            }));
            return this.connectionPromise;
        });
    }
    scheduleReconnect() {
        // Nettoyer les ressources existantes
        this.cleanup();
        // Programmer une nouvelle tentative de connexion
        if (!this.reconnectTimer) {
            this.reconnectTimer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                this.reconnectTimer = null;
                this.connectionPromise = null;
                try {
                    yield this.connect();
                    // Réenregistrer les consommateurs après la reconnexion
                    this.rebindConsumers();
                }
                catch (error) {
                    console.error("❌ Reconnection failed:", error);
                }
            }), 5000); // 5 secondes avant de tenter à nouveau
        }
    }
    cleanup() {
        this.consumers.clear();
        if (this.channel) {
            try {
                this.channel.close();
            }
            catch (error) {
                console.error("Error closing channel:", error);
            }
            this.channel = null;
        }
        if (this.connection) {
            try {
                this.connection.close();
            }
            catch (error) {
                console.error("Error closing connection:", error);
            }
            this.connection = null;
        }
    }
    // Méthode pour réenregistrer les consommateurs après une reconnexion
    rebindConsumers() {
        return __awaiter(this, void 0, void 0, function* () {
            // Cette méthode serait implémentée si vous avez des consumers permanents
            // Pour ce cas d'utilisation, nous n'avons pas besoin de l'implémenter
        });
    }
    createQueue(queueName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                yield this.connect();
            }
            if (this.channel) {
                yield this.channel.assertQueue(queueName, { durable: true });
                console.log(`✅ Queue ${queueName} created/confirmed`);
            }
        });
    }
    sendMessage(queueName, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                yield this.connect();
            }
            if (!this.channel) {
                throw new Error("❌ RabbitMQ channel not available");
            }
            yield this.createQueue(queueName);
            const messageBuffer = Buffer.from(JSON.stringify(message));
            const result = this.channel.sendToQueue(queueName, messageBuffer);
            console.log(`📤 Message sent to ${queueName}:`, message);
            return result;
        });
    }
    requestResponse(requestQueue_1, request_1, responseQueue_1) {
        return __awaiter(this, arguments, void 0, function* (requestQueue, request, responseQueue, timeout = 10000) {
            if (!this.channel) {
                yield this.connect();
            }
            if (!this.channel) {
                throw new Error("❌ RabbitMQ channel not available");
            }
            // Créer les deux queues
            yield this.createQueue(requestQueue);
            yield this.createQueue(responseQueue);
            // Générer un ID de corrélation unique pour cette requête
            const correlationId = Date.now().toString() + Math.random().toString(36).substring(2, 15);
            console.log(`📤 [${Date.now()}] Sending request to ${requestQueue} with correlationId: ${correlationId}`);
            // Attendre la réponse avant d'envoyer la requête
            const responsePromise = new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    var _a;
                    // Si le consumerTag existe, annuler le consumer
                    if (this.consumers.has(responseQueue)) {
                        const consumerTag = this.consumers.get(responseQueue);
                        if (consumerTag) {
                            (_a = this.channel) === null || _a === void 0 ? void 0 : _a.cancel(consumerTag);
                            this.consumers.delete(responseQueue);
                        }
                    }
                    reject(new Error(`Timeout waiting for response on ${responseQueue} for request ${correlationId}`));
                }, timeout);
                this.channel.consume(responseQueue, (msg) => {
                    var _a, _b, _c;
                    if (msg) {
                        // Accepter uniquement les messages avec notre correlationId
                        if (msg.properties.correlationId === correlationId) {
                            clearTimeout(timeoutId);
                            // Annuler le consommateur
                            if (this.consumers.has(responseQueue)) {
                                const consumerTag = this.consumers.get(responseQueue);
                                if (consumerTag) {
                                    (_a = this.channel) === null || _a === void 0 ? void 0 : _a.cancel(consumerTag).catch(err => {
                                        console.error(`Error canceling consumer: ${err}`);
                                    });
                                    this.consumers.delete(responseQueue);
                                }
                            }
                            // Acknowledge le message
                            (_b = this.channel) === null || _b === void 0 ? void 0 : _b.ack(msg);
                            // Traiter la réponse
                            try {
                                const content = JSON.parse(msg.content.toString());
                                console.log(`📥 [${Date.now()}] Received response for request ${correlationId}:`, content);
                                resolve(content);
                            }
                            catch (error) {
                                reject(new Error(`Failed to parse response message: ${error}`));
                            }
                        }
                        else {
                            // Ce n'est pas notre message, le remettre dans la queue
                            (_c = this.channel) === null || _c === void 0 ? void 0 : _c.nack(msg, false, true);
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
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.channel) {
                yield this.channel.close();
            }
            if (this.connection) {
                yield this.connection.close();
            }
            this.channel = null;
            this.connection = null;
            this.connectionPromise = null;
            console.log("✅ RabbitMQ connection closed");
        });
    }
}
exports.rabbitMQService = new RabbitMQService();
