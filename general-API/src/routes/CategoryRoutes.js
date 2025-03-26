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
router.post("", AuthMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to create category`);
        const category = yield rabbitmqService_1.rabbitMQService.requestResponse("create_category_queue", { request: req.body }, "create_category_response_queue", 1000);
        res.status(200).json(category);
    }
    catch (error) {
        console.error(`❌ Error creating category:`, error);
        res.status(500).json({ error: "Error creating category", message: error.message });
    }
}));
router.get("", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get categories`);
        const categories = yield rabbitmqService_1.rabbitMQService.requestResponse("get_categories_queue", { request: "getAllCategories" }, "get_categories_response_queue", 1000);
        res.status(200).json(categories);
    }
    catch (error) {
        console.error(`❌ Error fetching categories:`, error);
        res.status(500).json({ error: "Error fetching categories", message: error.message });
    }
}));
router.put("", AuthMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to update category`);
        const category = yield rabbitmqService_1.rabbitMQService.requestResponse("update_category_queue", { id: req.body.id, request: req.body }, "update_category_response_queue", 1000);
        res.status(200).json(category);
    }
    catch (error) {
        console.error(`❌ Error updating category:`, error);
        res.status(500).json({ error: "Error updating category", message: error.message });
    }
}));
router.delete("", AuthMiddleware_1.authenticateJWT, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(`📤 [${Date.now()}] Sending request to delete category`);
        const response = yield rabbitmqService_1.rabbitMQService.requestResponse("delete_category_queue", { id: req.body.id }, "delete_category_response_queue", 1000);
        res.status(200).json(response);
    }
    catch (error) {
        console.error(`❌ Error deleting category:`, error);
        res.status(500).json({ error: "Error deleting category", message: error.message });
    }
}));
exports.default = router;
