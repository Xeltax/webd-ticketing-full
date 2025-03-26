"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rabbitmqService_1 = require("../service/rabbitmqService");
const AuthMiddleware_1 = require("../Middleware/AuthMiddleware");
const router = (0, express_1.Router)();
// Event Routes
router.post("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to create event`);
        const event = yield rabbitmqService_1.rabbitMQService.requestResponse("create_event_queue", { request: req.body }, "create_event_response_queue", 1000);
        res.status(200).json(event);
    }
    catch (error) {
        console.error(`❌ Error creating event:`, error);
        res.status(500).json({ error: "Error creating event", message: error.message });
    }
}));
router.get("", AuthMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get events`);
        const events = yield rabbitmqService_1.rabbitMQService.requestResponse("get_event_queue", { request: "getAllEvents" }, "get_event_response_queue", 1000);
        res.status(200).json(events);
    }
    catch (error) {
        console.error(`❌ Error fetching events:`, error);
        res.status(500).json({ error: "Error fetching events", message: error.message });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get event by id`);
        const event = yield rabbitmqService_1.rabbitMQService.requestResponse("get_event_by_id_queue", { request: "getEventById", id: req.params.id }, "get_event_by_id_response_queue", 1000);
        res.status(200).json(event);
    }
    catch (error) {
        console.error(`❌ Error fetching event by id:`, error);
        res.status(500).json({ error: "Error fetching event by id", message: error.message });
    }
}));
router.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get events by user id`);
        const events = yield rabbitmqService_1.rabbitMQService.requestResponse("get_event_by_user_id_queue", { request: "getEventsByUserId", userId: req.params.id }, "get_event_by_user_id_response_queue", 1000);
        res.status(200).json(events);
    }
    catch (error) {
        console.error(`❌ Error fetching events by user id:`, error);
        res.status(500).json({ error: "Error fetching events by user id", message: error.message });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to delete event`);
        const event = yield rabbitmqService_1.rabbitMQService.requestResponse("delete_event_queue", { request: "deleteEvent", id: req.params.id }, "delete_event_response_queue", 1000);
        res.status(200).json(event);
    }
    catch (error) {
        console.error(`❌ Error deleting event:`, error);
        res.status(500).json({ error: "Error deleting event", message: error.message });
    }
}));
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to update event`);
        const event = yield rabbitmqService_1.rabbitMQService.requestResponse("update_event_queue", { request: req.body, id: req.params.id }, "update_event_response_queue", 1000);
        res.status(200).json(event);
    }
    catch (error) {
        console.error(`❌ Error updating event:`, error);
        res.status(500).json({ error: "Error updating event", message: error.message });
    }
}));
exports.default = router;
