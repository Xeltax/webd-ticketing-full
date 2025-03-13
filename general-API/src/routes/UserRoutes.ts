import { Router } from "express";
import amqp from 'amqplib/callback_api';
import { authenticateJWT } from "../Middleware/AuthMiddleware";
import {rabbitMQService} from "../service/rabbitmqService";

const router = Router();

// router.post("", userController.createUser.bind(userController));
router.get("", async (req, res) => {
    try {
        rabbitMQService.sendMessage("get_users_queue", {}).then(() => {
            // rabbitMQService.consumeMessages("get_users_queue", (msg: any) => {
            //     console.log("📥 First Message received:", msg);
            //     res.status(200).json(msg);
            // });
        });
    } catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
});
// router.put("", authenticateJWT, UserController.updateUser);
// router.delete("", authenticateJWT, UserController.deleteUser);

export default router;
