import { Router } from "express";
import amqp from 'amqplib/callback_api';
import { authenticateJWT } from "../Middleware/AuthMiddleware";
import {rabbitMQService} from "../service/rabbitmqService";

const router = Router();

// router.post("", userController.createUser.bind(userController));
router.get("", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get users`);

        // Utiliser la nouvelle méthode requestResponse
        const users = await rabbitMQService.requestResponse(
            "get_users_queue",             // Queue de requête
            { request: "getAllUsers" },    // Message
            "get_users_response_queue",    // Queue de réponse
            15000                          // Timeout augmenté à 15 secondes
        );

        console.log(`📥 [${Date.now()}] Received ${users.length || 0} users from microservice`);
        res.status(200).json(users);
    } catch (error :any) {
        console.error(`❌ [${Date.now()}] Error fetching users:`, error);
        res.status(500).json({ error: "Error fetching users", message: error.message });
    }
});
// router.put("", authenticateJWT, UserController.updateUser);
// router.delete("", authenticateJWT, UserController.deleteUser);

export default router;
