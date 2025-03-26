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
router.post("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to create reservation`);
        const reservation = yield rabbitmqService_1.rabbitMQService.requestResponse("create_reservation_queue", { request: req.body }, "create_reservation_response_queue", 1000);
        res.status(200).json(reservation);
    }
    catch (error) {
        console.error(`❌ Error creating reservation:`, error);
        res.status(500).json({ error: "Error creating reservation", message: error.message });
    }
}));
router.get("", AuthMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get reservations`);
        const reservations = yield rabbitmqService_1.rabbitMQService.requestResponse("get_reservations_queue", { request: "getAllReservations" }, "get_reservations_response_queue", 1000);
        res.status(200).json(reservations);
    }
    catch (error) {
        console.error(`❌ Error fetching reservations:`, error);
        res.status(500).json({ error: "Error fetching reservations", message: error.message });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get reservation by id`);
        const reservation = yield rabbitmqService_1.rabbitMQService.requestResponse("get_user_reservations_queue", { request: "getReservationById", id: req.params.id }, "get_user_reservations_response_queue", 1000);
        res.status(200).json(reservation);
    }
    catch (error) {
        console.error(`❌ Error fetching reservation by Userid:`, error);
        res.status(500).json({ error: "Error fetching reservation by Userid", message: error.message });
    }
}));
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to delete reservation by id`);
        const reservation = yield rabbitmqService_1.rabbitMQService.requestResponse("delete_reservation_queue", { request: "deleteReservationById", id: req.params.id }, "delete_reservation_response_queue", 1000);
        res.status(200).json(reservation);
    }
    catch (error) {
        console.error(`❌ Error deleting reservation by id:`, error);
        res.status(500).json({ error: "Error deleting reservation by id", message: error.message });
    }
}));
exports.default = router;
