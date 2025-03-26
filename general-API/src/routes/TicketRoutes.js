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
const router = (0, express_1.Router)();
// Ticket Routes
router.post("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to create ticket`);
        const ticket = yield rabbitmqService_1.rabbitMQService.requestResponse("create_ticket_queue", { request: req.body }, "create_ticket_response_queue", 1000);
        res.status(200).json(ticket);
    }
    catch (error) {
        console.error(`❌ Error creating ticket:`, error);
        res.status(500).json({ error: "Error creating ticket", message: error.message });
    }
}));
router.get("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get tickets`);
        const tickets = yield rabbitmqService_1.rabbitMQService.requestResponse("get_tickets_queue", { request: "getAllTickets" }, "get_tickets_response_queue", 1000);
        res.status(200).json(tickets);
    }
    catch (error) {
        console.error(`❌ Error fetching tickets:`, error);
        res.status(500).json({ error: "Error fetching tickets", message: error.message });
    }
}));
exports.default = router;
