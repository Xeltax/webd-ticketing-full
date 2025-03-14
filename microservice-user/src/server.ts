import { UserController } from "./controllers/UserController";
import { rabbitMQService } from "./services/rabbitmqService";

async function start() {
    try {
        await rabbitMQService.connect();
        await UserController.handleGetUsers();


        process.on("SIGINT", async () => {
            console.log("\nGracefully shutting down...");
            await rabbitMQService.close();
            process.exit(0);
        });

        await rabbitMQService.createQueue("get_users_queue");
        await rabbitMQService.createQueue("get_users_response_queue");
        console.log("🚀 Microservice User started!");
    } catch (error) {
        console.error("❌ Error starting microservice:", error);
        process.exit(1);
    }
}

start();
