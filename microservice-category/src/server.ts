import { CategoryController } from "./Controllers/CategoryController";
import { rabbitMQService } from "./Services/rabbitmqService";

async function start() {
    try {
        await rabbitMQService.connect();
        await CategoryController.handleGetCategories();
        await CategoryController.handleCreateCategory();

        process.on("SIGINT", async () => {
            console.log("\nGracefully shutting down...");
            await rabbitMQService.close();
            process.exit(0);
        });

        await rabbitMQService.createQueue("get_categories_queue");
        await rabbitMQService.createQueue("get_categories_response_queue");
        await rabbitMQService.createQueue("create_category_queue");
        await rabbitMQService.createQueue("create_category_response_queue");
        console.log("🚀 Microservice Categories started!");
    } catch (error) {
        console.error("❌ Error starting microservice:", error);
        process.exit(1);
    }
}

start();
