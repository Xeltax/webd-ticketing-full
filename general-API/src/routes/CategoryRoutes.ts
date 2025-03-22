import {Router} from "express";
import { rabbitMQService } from "../service/rabbitmqService";

const router = Router();

router.post("", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to create category`);
        const category = await rabbitMQService.requestResponse(
            "create_category_queue",
            { request: req.body },
            "create_category_response_queue",
            1000
        );
        res.status(200).json(category);
    } catch (error: any) {
        console.error(`❌ Error creating category:`, error);
        res.status(500).json({ error: "Error creating category", message: error.message });
    }
});

router.get("", async (req, res) => {
    try {
        console.log(`📤 [${Date.now()}] Sending request to get categories`);
        const categories = await rabbitMQService.requestResponse(
            "get_categories_queue",
            { request: "getAllCategories" },
            "get_categories_response_queue",
            1000
        );
        res.status(200).json(categories);
    } catch (error: any) {
        console.error(`❌ Error fetching categories:`, error);
        res.status(500).json({ error: "Error fetching categories", message: error.message });
    }
});

export default router;