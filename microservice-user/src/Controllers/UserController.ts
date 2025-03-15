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

    static async createUser(data: any) {
        return await userService.createUser(data.request);
    }

    static async handleCreateUser() {
        await rabbitMQService.consumeMessages("create_users_queue", async (msg, properties) => {
            const correlationId = properties.correlationId || "unknown";
            const replyTo = properties.replyTo || "create_users_response_queue";

            console.log(`📩 [${Date.now()}] Received request with ID ${correlationId}`);

            try {
                console.log(`🔍 [${Date.now()}] #${correlationId} Creating user with data:`, msg);
                const user = await UserController.createUser(msg);
                console.log(`✅ [${Date.now()}] #${correlationId} User created`);

                // Assurer que la queue de réponse existe
                await rabbitMQService.createQueue(replyTo);

                console.log(`📤 [${Date.now()}] #${correlationId} Sending response to ${replyTo}`);

                // Envoyer la réponse avec le même correlationId
                const sendResult = await rabbitMQService.sendMessage(replyTo, user, {
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

    static async getUserByEmail(email: string) {
        return await userService.getByEmail(email);
    }

    static async handleGetUserByEmail() {
        await rabbitMQService.consumeMessages("get_user_by_email_queue", async (msg, properties) => {
            const correlationId = properties.correlationId || "unknown";
            const replyTo = properties.replyTo || "get_user_by_email_response_queue";

            console.log(`📩 [${Date.now()}] Received request with ID ${correlationId}`);
            try {
                console.log(`🔍 [${Date.now()}] #${correlationId} Fetching user with email:`, msg);
                const user = await UserController.getUserByEmail(msg.data.email);

                console.log(`✅ [${Date.now()}] #${correlationId} Found user`);

                // Assurer que la queue de réponse existe
                await rabbitMQService.createQueue(replyTo);

                console.log(`📤 [${Date.now()}] #${correlationId} Sending response to ${replyTo}`);

                // Envoyer la réponse avec le même correlationId
                const sendResult = await rabbitMQService.sendMessage(replyTo, user, {
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