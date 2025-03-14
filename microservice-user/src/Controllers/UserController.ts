import { UserService } from "../services/UserService";
import { rabbitMQService } from "../services/rabbitmqService";

const userService = new UserService();

export class UserController {
    static async getAllUsers() {
        return await userService.getAllUsers();
    }

    static async handleGetUsers() {
        await rabbitMQService.consumeMessages("get_users_queue", async (msg, properties) => {
            const correlationId = properties.correlationId || "unknown";
            const replyTo = properties.replyTo || "get_users_response_queue";

            console.log(`📩 [${Date.now()}] Received request with ID ${correlationId}`);

            try {
                console.log(`🔍 [${Date.now()}] #${correlationId} Fetching users`);
                const users = await UserController.getAllUsers();
                console.log(`✅ [${Date.now()}] #${correlationId} Found ${users.length} users`);

                // Assurer que la queue de réponse existe
                await rabbitMQService.createQueue(replyTo);

                console.log(`📤 [${Date.now()}] #${correlationId} Sending response to ${replyTo}`);

                // Envoyer la réponse avec le même correlationId
                const sendResult = await rabbitMQService.sendMessage(replyTo, users, {
                    correlationId: correlationId
                });

                console.log(`📨 [${Date.now()}] #${correlationId} Send result: ${sendResult ? "Success" : "Failed"}`);
            } catch (error :any) {
                console.error(`❌ [${Date.now()}] #${correlationId} Error:`, error);

                // Envoyer une réponse d'erreur avec le même correlationId
                await rabbitMQService.sendMessage(replyTo, {
                    error: "Failed to process user request",
                    details: error.message
                }, {
                    correlationId: correlationId
                });
            }
        });
    }
}