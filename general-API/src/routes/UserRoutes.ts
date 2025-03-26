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

router.get("/:id", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get user by id`);

        // Utiliser la nouvelle méthode requestResponse
        const user = await rabbitMQService.requestResponse(
            "get_user_by_id_queue",             // Queue de requête
            { request: "getUserById", id: req.params.id },    // Message
            "get_user_by_id_response_queue",    // Queue de réponse
            1000                          // Timeout augmenté à 15 secondes
        );

        console.log(`📥 [${Date.now()}] Received user from microservice`);
        res.status(200).json(user);
    } catch (error :any) {
        console.error(`❌ [${Date.now()}] Error fetching user:`, error);
        res.status(500).json({ error: "Error fetching user", message: error.message });
    }
})

router.put("", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to update user`);

        // Utiliser la nouvelle méthode requestResponse
        const user = await rabbitMQService.requestResponse(
            "update_user_by_id_queue",             // Queue de requête
            { request: "updateUser", data: req.body },    // Message
            "update_user_by_id_response_queue",    // Queue de réponse
            1000                          // Timeout augmenté à 15 secondes
        );

        console.log(`📥 [${Date.now()}] Received updated user from microservice`);
        res.status(200).json(user);
    } catch (error :any) {
        console.error(`❌ [${Date.now()}] Error updating user:`, error);
        res.status(500).json({ error: "Error updating user", message: error.message });
    }
})

router.delete("", authenticateJWT, async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to delete user`);

        // Utiliser la nouvelle méthode requestResponse
        const response = await rabbitMQService.requestResponse(
            "delete_user_by_id_queue",             // Queue de requête
            { request: "deleteUser", id: req.body.id },    // Message
            "delete_user_by_id_response_queue",    // Queue de réponse
            1000                          // Timeout augmenté à 15 secondes
        );

        console.log(`📥 [${Date.now()}] Received response from microservice`);
        res.status(200).json(response);
    } catch (error :any) {
        console.error(`❌ [${Date.now()}] Error deleting user:`, error);
        res.status(500).json({ error: "Error deleting user", message: error.message });
    }
})

export default router;
