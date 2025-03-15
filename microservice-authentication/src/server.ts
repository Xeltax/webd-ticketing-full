import { rabbitMQService } from "./services/rabbitmqService";
import {AuthenticationController} from "./Controllers/AuthenticationController";

async function start() {
    try {
        await rabbitMQService.connect();
        await AuthenticationController.handleLogin();
        await AuthenticationController.handleRegister();


        process.on("SIGINT", async () => {
            console.log("\nGracefully shutting down...");
            await rabbitMQService.close();
            process.exit(0);
        });

        await rabbitMQService.createQueue("register_users_queue");
        await rabbitMQService.createQueue("register_users_response_queue");
        await rabbitMQService.createQueue("login_user_queue");
        await rabbitMQService.createQueue("login_user_response_queue");
        await rabbitMQService.createQueue("create_users_queue");
        await rabbitMQService.createQueue("create_users_response_queue");
        console.log("🚀 Microservice User started!");
    } catch (error) {
        console.error("❌ Error starting microservice:", error);
        process.exit(1);
    }
}

start();
