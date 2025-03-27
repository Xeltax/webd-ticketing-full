import { sendMail } from "./services/MailerService";
import { rabbitMQService } from "./services/rabbitmqService";

async function start() {
    try {
        await rabbitMQService.connect();
        await sendMail()

        process.on("SIGINT", async () => {
            console.log("\nGracefully shutting down...");
            await rabbitMQService.close();
            process.exit(0);
        });

        await rabbitMQService.createQueue("send_mail_queue");
        await rabbitMQService.createQueue("send_mail_response_queue");

        console.log("🚀 Microservice Mailer started!");
    } catch (error) {
        console.error("❌ Error starting microservice:", error);
        process.exit(1);
    }
}

start();
