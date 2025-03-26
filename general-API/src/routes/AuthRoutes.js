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
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get users`);
        console.log(req.body);
        // Utiliser la nouvelle méthode requestResponse
        const user = yield rabbitmqService_1.rabbitMQService.requestResponse("get_user_by_email_queue", // Queue de requête
        { request: "getUserByEmail", data: req.body }, // Message
        "get_user_by_email_response_queue", // Queue de réponse
        1000 // Timeout augmenté à 15 secondes
        );
        const authUser = yield rabbitmqService_1.rabbitMQService.requestResponse("login_user_queue", // Queue de requête
        { request: "loginUser", data: { credentials: req.body, user: user } }, // Message
        "login_user_response_queue", // Queue de réponse
        1000 // Timeout augmenté à 15 secondes
        );
        console.log(`📥 [${Date.now()}] Received ${user.length || 0} users from microservice`);
        if (authUser.error) {
            throw new Error(authUser.details);
        }
        res.status(200).json(authUser);
    }
    catch (error) {
        console.error(`❌ [${Date.now()}] Error fetching users:`, error);
        res.status(500).json({ error: "Error fetching users", message: error.message });
    }
}));
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to users microservice`);
        // Utiliser la nouvelle méthode requestResponse
        const authFormattedUser = yield rabbitmqService_1.rabbitMQService.requestResponse("register_users_queue", // Queue de requête
        { request: req.body }, // Message
        "register_users_response_queue", // Queue de réponse
        1000 // Timeout augmenté à 15 secondes
        );
        console.log(`📥 [${Date.now()}] Received ${authFormattedUser} users from microservice`);
        console.log(authFormattedUser);
        // Utiliser la nouvelle méthode requestResponse
        const users = yield rabbitmqService_1.rabbitMQService.requestResponse("create_users_queue", // Queue de requête
        { request: authFormattedUser }, // Message
        "create_users_response_queue", // Queue de réponse
        1000 // Timeout augmenté à 15 secondes
        );
        if (users.error) {
            throw new Error(users.details);
        }
        res.status(200).json(users);
    }
    catch (error) {
        console.error(`❌ [${Date.now()}] Error creating users:`, error);
        res.status(500).json({ error: "Error creating users", message: error.message });
    }
}));
exports.default = router;
