import { UserController } from "./Controllers/UserController";
import { rabbitMQService } from "./services/rabbitmqService";

async function start() {
    try {
        await rabbitMQService.connect();
        await UserController.handleGetUsers();
        await UserController.handleCreateUser();
        await UserController.handleGetUserByEmail();
        await UserController.handleGetUserById();
        await UserController.handleUpdateUser();
        await UserController.handleDeleteUser();


        process.on("SIGINT", async () => {
            console.log("\nGracefully shutting down...");
            await rabbitMQService.close();
            process.exit(0);
        });

        await rabbitMQService.createQueue("get_users_queue");
        await rabbitMQService.createQueue("get_users_response_queue");

        await rabbitMQService.createQueue("get_user_by_email_queue");
        await rabbitMQService.createQueue("get_user_by_email_response_queue");

        await rabbitMQService.createQueue("get_user_by_id_queue");
        await rabbitMQService.createQueue("get_user_by_id_response_queue");

        await rabbitMQService.createQueue("create_users_queue");
        await rabbitMQService.createQueue("create_users_response_queue");

        await rabbitMQService.createQueue("update_user_by_id_queue");
        await rabbitMQService.createQueue("update_user_by_id_response_queue");

        await rabbitMQService.createQueue("delete_user_by_id_queue");
        await rabbitMQService.createQueue("delete_user_by_id_response_queue");

        console.log("🚀 Microservice Event started!");
    } catch (error) {
        console.error("❌ Error starting microservice:", error);
        process.exit(1);
    }
}

start();
