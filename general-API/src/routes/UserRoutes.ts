import { Router } from "express";
import amqp from 'amqplib/callback_api';
import { authenticateJWT } from "../Middleware/AuthMiddleware";
import {rabbitMQService} from "../service/rabbitmqService";

const router = Router();

router.post("", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to users microservice`);

        // Utiliser la nouvelle méthode requestResponse
        const users = await rabbitMQService.requestResponse(
            "create_users_queue",             // Queue de requête
            { request: req.body },    // Message
            "create_users_response_queue",    // Queue de réponse
            1000                          // Timeout augmenté à 15 secondes
        );

        console.log(`📥 [${Date.now()}] Received ${users.length || 0} users from microservice`);
        res.status(200).json(users);
    } catch (error :any) {
        console.error(`❌ [${Date.now()}] Error creating users:`, error);
        res.status(500).json({ error: "Error creating users", message: error.message });
    }
});

router.get("", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get users`);

        // Utiliser la nouvelle méthode requestResponse
        const users = await rabbitMQService.requestResponse(
            "get_users_queue",             // Queue de requête
            { request: "getAllUsers" },    // Message
            "get_users_response_queue",    // Queue de réponse
            1000                          // Timeout augmenté à 15 secondes
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
