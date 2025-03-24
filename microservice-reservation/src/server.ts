import { ReservationController } from "./Controllers/ReservationController";
import { rabbitMQService } from "./services/rabbitmqService";

async function start() {
    try {
        await rabbitMQService.connect();
        await ReservationController.handleGetReservations();
        await ReservationController.handleCreateReservation();
        await ReservationController.handleGetUserReservations();

        process.on("SIGINT", async () => {
            console.log("\nGracefully shutting down...");
            await rabbitMQService.close();
            process.exit(0);
        });

        await rabbitMQService.createQueue("get_reservations_queue");
        await rabbitMQService.createQueue("get_reservations_response_queue");

        await rabbitMQService.createQueue("get_user_reservations_queue");
        await rabbitMQService.createQueue("get_user_reservations_response_queue");

        await rabbitMQService.createQueue("create_reservation_queue");
        await rabbitMQService.createQueue("create_reservation_response_queue");
        console.log("🚀 Microservice Categories started!");
    } catch (error) {
        console.error("❌ Error starting microservice:", error);
        process.exit(1);
    }
}

start();
