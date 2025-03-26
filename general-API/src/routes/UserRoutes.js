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
const AuthMiddleware_1 = require("../Middleware/AuthMiddleware");
const rabbitmqService_1 = require("../service/rabbitmqService");
const router = (0, express_1.Router)();
router.post("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to users microservice`);
        // Utiliser la nouvelle méthode requestResponse
        const users = yield rabbitmqService_1.rabbitMQService.requestResponse("create_users_queue", // Queue de requête
        { request: req.body }, // Message
        "create_users_response_queue", // Queue de réponse
        1000 // Timeout augmenté à 15 secondes
        );
        console.log(`📥 [${Date.now()}] Received ${users.length || 0} users from microservice`);
        res.status(200).json(users);
    }
    catch (error) {
        console.error(`❌ [${Date.now()}] Error creating users:`, error);
        res.status(500).json({ error: "Error creating users", message: error.message });
    }
}));
router.get("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get users`);
        // Utiliser la nouvelle méthode requestResponse
        const users = yield rabbitmqService_1.rabbitMQService.requestResponse("get_users_queue", // Queue de requête
        { request: "getAllUsers" }, // Message
        "get_users_response_queue", // Queue de réponse
        1000 // Timeout augmenté à 15 secondes
        );
        console.log(`📥 [${Date.now()}] Received ${users.length || 0} users from microservice`);
        res.status(200).json(users);
    }
    catch (error) {
        console.error(`❌ [${Date.now()}] Error fetching users:`, error);
        res.status(500).json({ error: "Error fetching users", message: error.message });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get user by id`);
        // Utiliser la nouvelle méthode requestResponse
        const user = yield rabbitmqService_1.rabbitMQService.requestResponse("get_user_by_id_queue", // Queue de requête
        { request: "getUserById", id: req.params.id }, // Message
        "get_user_by_id_response_queue", // Queue de réponse
        1000 // Timeout augmenté à 15 secondes
        );
        console.log(`📥 [${Date.now()}] Received user from microservice`);
        res.status(200).json(user);
    }
    catch (error) {
        console.error(`❌ [${Date.now()}] Error fetching user:`, error);
        res.status(500).json({ error: "Error fetching user", message: error.message });
    }
}));
router.put("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to update user`);
        // Utiliser la nouvelle méthode requestResponse
        const user = yield rabbitmqService_1.rabbitMQService.requestResponse("update_user_by_id_queue", // Queue de requête
        { request: "updateUser", data: req.body }, // Message
        "update_user_by_id_response_queue", // Queue de réponse
        1000 // Timeout augmenté à 15 secondes
        );
        console.log(`📥 [${Date.now()}] Received updated user from microservice`);
        res.status(200).json(user);
    }
    catch (error) {
        console.error(`❌ [${Date.now()}] Error updating user:`, error);
        res.status(500).json({ error: "Error updating user", message: error.message });
    }
}));
router.delete("", AuthMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to delete user`);
        // Utiliser la nouvelle méthode requestResponse
        const response = yield rabbitmqService_1.rabbitMQService.requestResponse("delete_user_by_id_queue", // Queue de requête
        { request: "deleteUser", id: req.body.id }, // Message
        "delete_user_by_id_response_queue", // Queue de réponse
        1000 // Timeout augmenté à 15 secondes
        );
        console.log(`📥 [${Date.now()}] Received response from microservice`);
        res.status(200).json(response);
    }
    catch (error) {
        console.error(`❌ [${Date.now()}] Error deleting user:`, error);
        res.status(500).json({ error: "Error deleting user", message: error.message });
    }
}));
exports.default = router;
