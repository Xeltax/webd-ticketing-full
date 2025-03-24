import { ReservationService } from "../services/ReservationService";
import { rabbitMQService } from "../services/rabbitmqService";

const reservationService = new ReservationService();

export class ReservationController {
    static async getAllReservations() {
        return await reservationService.getAllReservations();
    }

    static async handleGetReservations() {
        await rabbitMQService.consumeMessages("get_reservations_queue", async (msg, properties) => {
            const correlationId = properties.correlationId || "unknown";
            const replyTo = properties.replyTo || "get_reservations_response_queue";

            try {
                console.log(`🔍 [${Date.now()}] #${correlationId} Fetching reservations`);
                const reservations = await ReservationController.getAllReservations();

                await rabbitMQService.createQueue(replyTo);
                await rabbitMQService.sendMessage(replyTo, reservations, { correlationId });
            } catch (error: any) {
                await rabbitMQService.sendMessage(replyTo, { error: "Failed to fetch reservations", details: error.message }, { correlationId });
            }
        });
    }

    static async createReservation(data: any) {
        return await reservationService.createReservation(data.request);
    }

    static async handleCreateReservation() {
        await rabbitMQService.consumeMessages("create_reservation_queue", async (msg, properties) => {
            const correlationId = properties.correlationId || "unknown";
            const replyTo = properties.replyTo || "create_reservation_response_queue";

            try {
                console.log(`🔍 [${Date.now()}] #${correlationId} Creating reservation with data:`, msg);
                const reservation = await ReservationController.createReservation(msg);

                await rabbitMQService.createQueue(replyTo);
                await rabbitMQService.sendMessage(replyTo, reservation, { correlationId });
            } catch (error: any) {
                await rabbitMQService.sendMessage(replyTo, { error: "Failed to create reservation", details: error.message }, { correlationId });
            }
        });
    }

    static async getUserReservations(id: string) {
        return await reservationService.getUserReservations(id);
    }

    static async handleGetUserReservations() {
        await rabbitMQService.consumeMessages("get_user_reservations_queue", async (msg, properties) => {
            const correlationId = properties.correlationId || "unknown";
            const replyTo = properties.replyTo || "get_user_reservations_response_queue";

            try {
                console.log(`🔍 [${Date.now()}] #${correlationId} Fetching reservations for user with id: ${msg.userId}`);
                const reservations = await ReservationController.getUserReservations(msg.userId);

                await rabbitMQService.createQueue(replyTo);
                await rabbitMQService.sendMessage(replyTo, reservations, {correlationId});
            } catch (error: any) {
                await rabbitMQService.sendMessage(replyTo, {
                    error: "Failed to fetch reservations",
                    details: error.message
                }, {correlationId});
            }
        });
    }
}