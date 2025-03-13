import { UserService } from "../services/UserService";
import { rabbitMQService } from "../services/rabbitmqService";

const userService = new UserService();

export class UserController {
    static async getAllUsers() {
        return await userService.getAllUsers();
    }

    static async handleGetUsers() {
        await rabbitMQService.consumeMessages("get_users_queue", async (msg: any) => {
            console.log("[x] Processing getAllUsers request...");
            const users = await UserController.getAllUsers();
            console.log(`✅ Users fetched, ${users} sending response...`);
            // await rabbitMQService.sendMessage("get_users_queue", users);
        });
    }
}