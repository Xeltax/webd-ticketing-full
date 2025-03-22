import { Router } from "express";
import { rabbitMQService } from "../service/rabbitmqService";

const router = Router();

// Event Routes
router.post("", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to create event`);
        const event = await rabbitMQService.requestResponse(
            "create_event_queue",
            { request: req.body },
            "create_event_response_queue",
            1000
        );
        res.status(200).json(event);
    } catch (error: any) {
        console.error(`❌ Error creating event:`, error);
        res.status(500).json({ error: "Error creating event", message: error.message });
    }
});

router.get("", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get events`);
        const events = await rabbitMQService.requestResponse(
            "get_events_queue",
            { request: "getAllEvents" },
            "get_events_response_queue",
            1000
        );
        res.status(200).json(events);
    } catch (error: any) {
        console.error(`❌ Error fetching events:`, error);
        res.status(500).json({ error: "Error fetching events", message: error.message });
    }
});

export default router;