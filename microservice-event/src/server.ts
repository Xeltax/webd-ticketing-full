import { EventController } from "./Controllers/EventController";
import { rabbitMQService } from "./services/rabbitmqService";

async function start() {
    try {
        await rabbitMQService.connect();
        await EventController.handleGetEvents();
        await EventController.handleCreateEvent();
        await EventController.handleGetEventById();
        await EventController.handleGetEventByUserId();
        await EventController.handleDeleteEvent();

        process.on("SIGINT", async () => {
            console.log("\nGracefully shutting down...");
            await rabbitMQService.close();
            process.exit(0);
        });

        await rabbitMQService.createQueue("get_event_queue");
        await rabbitMQService.createQueue("get_event_response_queue");

        await rabbitMQService.createQueue("get_event_by_id_queue");
        await rabbitMQService.createQueue("get_event_by_id_response_queue");

        await rabbitMQService.createQueue("create_event_queue");
        await rabbitMQService.createQueue("create_event_response_queue");

        await rabbitMQService.createQueue("delete_event_queue");
        await rabbitMQService.createQueue("delete_event_response_queue");

        await rabbitMQService.createQueue("get_event_by_user_id_queue");
        await rabbitMQService.createQueue("get_event_by_user_id_response_queue");
        console.log("🚀 Microservice Event started!");
    } catch (error) {
        console.error("❌ Error starting microservice:", error);
        process.exit(1);
    }
}

start();
