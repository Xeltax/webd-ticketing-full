import * as amqp from "amqplib";

class RabbitmqService {
    connection!: any;
    channel!: any;

    async connect() {
        try {
            this.connection = await amqp.connect("amqp://localhost:5672");
            this.channel = await this.connection.createChannel();
            await this.channel.assertQueue("get_users_queue");
            console.log(`✅ Connected to RabbitMQ - Queue: ${"get_users_queue"}`);
        } catch (error) {
            console.error("❌ Error connecting to RabbitMQ:", error);
        }
    }

    async sendMessage(queue: string, message: any) {
        if (!this.channel) {
            console.error("❌ RabbitMQ channel not initialized");
            return;
        }
        this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log(`📤 Sent ${JSON.stringify(message)} message to queue: ${queue}`);
    }

    async consumeMessages(queueName: string, callback: (msg: any) => void) {
        if (!this.channel) {
            console.error("❌ RabbitMQ channel not initialized");
            return;
        }
        await this.channel.consume(queueName, (msg : any) => {
            if (msg) {
                console.log("📥 Message received:", msg.content.toString());
                callback(JSON.parse(msg.content.toString()));
                this.channel.ack(msg);
            }
        });
    }

    async close() {
        if (this.connection) {
            await this.connection.close();
            console.log("❌ RabbitMQ connection closed");
        }
    }
}

export const rabbitMQService = new RabbitmqService();
