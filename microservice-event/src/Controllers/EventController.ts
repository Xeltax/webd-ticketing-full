import { EventService } from "../services/EventService";
import { rabbitMQService } from "../services/rabbitmqService";

const eventService = new EventService();

export class EventController {
    static async getAllEvents() {
        return await eventService.getAllEvents();
    }

    static async handleGetEvents() {
        await rabbitMQService.consumeMessages("get_event_queue", async (msg, properties) => {
            const correlationId = properties.correlationId || "unknown";
            const replyTo = properties.replyTo || "get_event_response_queue";

            console.log(`📩 [${Date.now()}] Received request with ID ${correlationId}`);

            try {
                console.log(`🔍 [${Date.now()}] #${correlationId} Fetching events`);
                const event = await EventController.getAllEvents();
                console.log(`✅ [${Date.now()}] #${correlationId} Found ${event.length} event`);

                // Assurer que la queue de réponse existe
                await rabbitMQService.createQueue(replyTo);

                console.log(`📤 [${Date.now()}] #${correlationId} Sending response to ${replyTo}`);

                // Envoyer la réponse avec le même correlationId
                const sendResult = await rabbitMQService.sendMessage(replyTo, event, {
                    correlationId: correlationId
                });

                console.log(`📨 [${Date.now()}] #${correlationId} Send result: ${sendResult ? "Success" : "Failed"}`);
            } catch (error :any) {
                console.error(`❌ [${Date.now()}] #${correlationId} Error:`, error);

                // Envoyer une réponse d'erreur avec le même correlationId
                await rabbitMQService.sendMessage(replyTo, {
                    error: "Failed to process event request",
                    details: error.message
                }, {
                    correlationId: correlationId
                });
            }
        });
    }

    static async createEvent(data: any) {
        return await eventService.createEvent(data.request);
    }

    static async handleCreateEvent() {
        await rabbitMQService.consumeMessages("create_event_queue", async (msg, properties) => {
            const correlationId = properties.correlationId || "unknown";
            const replyTo = properties.replyTo || "create_event_response_queue";

            console.log(`📩 [${Date.now()}] Received request with ID ${correlationId}`);

            try {
                console.log(`🔍 [${Date.now()}] #${correlationId} Creating event with data:`, msg);
                const event = await EventController.createEvent(msg);
                console.log(`✅ [${Date.now()}] #${correlationId} event created`);

                // Assurer que la queue de réponse existe
                await rabbitMQService.createQueue(replyTo);

                console.log(`📤 [${Date.now()}] #${correlationId} Sending response to ${replyTo}`);

                // Envoyer la réponse avec le même correlationId
                const sendResult = await rabbitMQService.sendMessage(replyTo, event, {
                    correlationId: correlationId
                });

                console.log(`📨 [${Date.now()}] #${correlationId} Send result: ${sendResult ? "Success" : "Failed"}`);
            } catch (error :any) {
                console.error(`❌ [${Date.now()}] #${correlationId} Error:`, error);

                // Envoyer une réponse d'erreur avec le même correlationId
                await rabbitMQService.sendMessage(replyTo, {
                    error: "Failed to process event request",
                    details: error.message
                }, {
                    correlationId: correlationId
                });
            }
        });
    }

    static async getEventById(id: string) {
        return await eventService.getById(id);
    }

    static async handleGetEventById() {
        await rabbitMQService.consumeMessages("get_event_by_id_queue", async (msg, properties) => {
            const correlationId = properties.correlationId || "unknown";
            const replyTo = properties.replyTo || "get_event_by_id_response_queue";

            console.log(`📩 [${Date.now()}] Received request with ID ${correlationId}`);
            try {
                console.log(`🔍 [${Date.now()}] #${correlationId} Fetching event with id:`, msg);
                const event = await EventController.getEventById(msg.data.id);

                console.log(`✅ [${Date.now()}] #${correlationId} Found event`);

                // Assurer que la queue de réponse existe
                await rabbitMQService.createQueue(replyTo);

                console.log(`📤 [${Date.now()}] #${correlationId} Sending response to ${replyTo}`);

                // Envoyer la réponse avec le même correlationId
                const sendResult = await rabbitMQService.sendMessage(replyTo, event, {
                    correlationId: correlationId
                });

                console.log(`📨 [${Date.now()}] #${correlationId} Send result: ${sendResult ? "Success" : "Failed"}`);
            } catch (error :any) {
                console.error(`❌ [${Date.now()}] #${correlationId} Error:`, error);

                // Envoyer une réponse d'erreur avec le même correlationId
                await rabbitMQService.sendMessage(replyTo, {
                    error: "Failed to process event request",
                    details: error.message
                }, {
                    correlationId: correlationId
                });
            }
        });
    }
}