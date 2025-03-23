import {AuthenticationService} from "../services/AuthenticationService";
import {rabbitMQService} from "../../../microservice-user/src/services/rabbitmqService";
import {AuthDTO} from "../Dtos/AuthDTO";
import {User} from "../../../microservice-user/src/Models/User"
import { UserDTO} from "../../../microservice-user/src/Dtos/UserDTO";

const authService : AuthenticationService = new AuthenticationService();

export class AuthenticationController {

    static async login(credentials : AuthDTO, user : User) {
        return await authService.login(credentials, user);
    }

    static async handleLogin() {
        await rabbitMQService.consumeMessages("login_user_queue", async (msg, properties) => {
            const correlationId = properties.correlationId || "unknown";
            const replyTo = properties.replyTo || "login_user_response_queue";

            console.log(`📩 [${Date.now()}] Received request with ID ${correlationId}`);

            try {
                console.log(`🔍 [${Date.now()}] #${correlationId} Fetching users`);
                const user = await AuthenticationController.login(msg.data.credentials, msg.data.user);
                console.log(`✅ [${Date.now()}] #${correlationId} Found ${user} users`);

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
                    error: "Failed to process auth request",
                    details: error.message
                }, {
                    correlationId: correlationId
                });
            }
        });
    }

    static async register(user : UserDTO) {
        return await authService.register(user);
    }

    static async handleRegister() {
        await rabbitMQService.consumeMessages("register_users_queue", async (msg, properties) => {
            const correlationId = properties.correlationId || "unknown";
            const replyTo = properties.replyTo || "register_users_response_queue";

            try {
                const user = await AuthenticationController.register(msg.request);

                await rabbitMQService.createQueue(replyTo);

                const sendResult = await rabbitMQService.sendMessage(replyTo, user, {
                    correlationId: correlationId
                });
            } catch (error :any) {
                // Envoyer une réponse d'erreur avec le même correlationId
                await rabbitMQService.sendMessage(replyTo, {
                    error: "Failed to process auth request",
                    details: error.message
                }, {
                    correlationId: correlationId
                });
            }
        });
    }
    //
    // static async logout(req: Request, res: Response) {
    //     try {
    //         res.json("Successfully logged out");
    //     } catch (error: any) {
    //         res.status(400).json({ error: error.message });
    //     }
    // }
}