import { Router } from "express";
import {rabbitMQService} from "../service/rabbitmqService";

const router = Router();

router.post("/login", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get users`);

        console.log(req.body);

        // Utiliser la nouvelle méthode requestResponse
        const user = await rabbitMQService.requestResponse(
            "get_user_by_email_queue",             // Queue de requête
            { request: "getUserByEmail", data : req.body },    // Message
            "get_user_by_email_response_queue",    // Queue de réponse
            1000                          // Timeout augmenté à 15 secondes
        );

        const authUser = await rabbitMQService.requestResponse(
            "login_user_queue",             // Queue de requête
            { request: "loginUser", data : { credentials : req.body, user : user }},    // Message
            "login_user_response_queue",    // Queue de réponse
            1000                          // Timeout augmenté à 15 secondes
        );

        console.log(`📥 [${Date.now()}] Received ${user.length || 0} users from microservice`);
        res.status(200).json(authUser);
    } catch (error :any) {
        console.error(`❌ [${Date.now()}] Error fetching users:`, error);
        res.status(500).json({ error: "Error fetching users", message: error.message });
    }
});

router.post("/register", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to users microservice`);

        // Utiliser la nouvelle méthode requestResponse
        const authFormattedUser = await rabbitMQService.requestResponse(
            "register_users_queue",             // Queue de requête
            { request: req.body },    // Message
            "register_users_response_queue",    // Queue de réponse
            1000                          // Timeout augmenté à 15 secondes
        );

        console.log(`📥 [${Date.now()}] Received ${authFormattedUser} users from microservice`);

        console.log(authFormattedUser)

        // Utiliser la nouvelle méthode requestResponse
        const users = await rabbitMQService.requestResponse(
            "create_users_queue",             // Queue de requête
            { request: authFormattedUser },    // Message
            "create_users_response_queue",    // Queue de réponse
            1000                          // Timeout augmenté à 15 secondes
        );

        if (users.error) {
            throw new Error(users.details);
        }

        res.status(200).json(users);
    } catch (error :any) {
        console.error(`❌ [${Date.now()}] Error creating users:`, error);
        res.status(500).json({ error: "Error creating users", message: error.message });
    }
})

export default router;