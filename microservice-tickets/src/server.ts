import { TicketController } from "./Controllers/TicketController";
import { rabbitMQService } from "./Services/rabbitmqService";

async function start() {
    try {
        await rabbitMQService.connect();
        await TicketController.handleGetTickets();
        await TicketController.handleCreateTicket();

        process.on("SIGINT", async () => {
            console.log("\nGracefully shutting down...");
            await rabbitMQService.close();
            process.exit(0);
        });

        await rabbitMQService.createQueue("get_tickets_queue");
        await rabbitMQService.createQueue("get_tickets_response_queue");
        await rabbitMQService.createQueue("create_ticket_queue");
        await rabbitMQService.createQueue("create_ticket_response_queue");
        console.log("🚀 Microservice Tickets started!");
    } catch (error) {
        console.error("❌ Error starting microservice:", error);
        process.exit(1);
    }
}

start();