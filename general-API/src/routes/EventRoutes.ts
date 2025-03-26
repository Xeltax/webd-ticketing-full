import { Router } from "express";
import { rabbitMQService } from "../service/rabbitmqService";
import {authenticateJWT} from "../Middleware/AuthMiddleware";

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

router.get("", authenticateJWT, async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get events`);
        const events = await rabbitMQService.requestResponse(
            "get_event_queue",
            { request: "getAllEvents" },
            "get_event_response_queue",
            1000
        );
        res.status(200).json(events);
    } catch (error: any) {
        console.error(`❌ Error fetching events:`, error);
        res.status(500).json({ error: "Error fetching events", message: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get event by id`);
        const event = await rabbitMQService.requestResponse(
            "get_event_by_id_queue",
            { request: "getEventById", id: req.params.id },
            "get_event_by_id_response_queue",
            1000
        );
        res.status(200).json(event);
    } catch (error: any) {
        console.error(`❌ Error fetching event by id:`, error);
        res.status(500).json({ error: "Error fetching event by id", message: error.message });
    }
})

router.get("/user/:id", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get events by user id`);
        const events = await rabbitMQService.requestResponse(
            "get_event_by_user_id_queue",
            { request: "getEventsByUserId", userId: req.params.id },
            "get_event_by_user_id_response_queue",
            1000
        );
        res.status(200).json(events);
    } catch (error: any) {
        console.error(`❌ Error fetching events by user id:`, error);
        res.status(500).json({ error: "Error fetching events by user id", message: error.message });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to delete event`);
        const event = await rabbitMQService.requestResponse(
            "delete_event_queue",
            { request: "deleteEvent", id: req.params.id },
            "delete_event_response_queue",
            1000
        );
        res.status(200).json(event);
    } catch (error: any) {
        console.error(`❌ Error deleting event:`, error);
        res.status(500).json({ error: "Error deleting event", message: error.message });
    }
})

router.put("/:id", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to update event`);
        const event = await rabbitMQService.requestResponse(
            "update_event_queue",
            { request: req.body, id: req.params.id },
            "update_event_response_queue",
            1000
        );
        res.status(200).json(event);
    } catch (error: any) {
        console.error(`❌ Error updating event:`, error);
        res.status(500).json({ error: "Error updating event", message: error.message });
    }
});

export default router;