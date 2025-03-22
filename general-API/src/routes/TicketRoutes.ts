import {Router} from "express";
import { rabbitMQService } from "../service/rabbitmqService";

const router = Router();
// Ticket Routes
router.post("", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to create ticket`);
        const ticket = await rabbitMQService.requestResponse(
            "create_ticket_queue",
            { request: req.body },
            "create_ticket_response_queue",
            1000
        );
        res.status(200).json(ticket);
    } catch (error: any) {
        console.error(`❌ Error creating ticket:`, error);
        res.status(500).json({ error: "Error creating ticket", message: error.message });
    }
});

router.get("", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get tickets`);
        const tickets = await rabbitMQService.requestResponse(
            "get_tickets_queue",
            { request: "getAllTickets" },
            "get_tickets_response_queue",
            1000
        );
        res.status(200).json(tickets);
    } catch (error: any) {
        console.error(`❌ Error fetching tickets:`, error);
        res.status(500).json({ error: "Error fetching tickets", message: error.message });
    }
});

export default router;