import { CategoryService } from "../Services/CategoryService";
import { rabbitMQService } from "../Services/rabbitmqService";

const categoryService = new CategoryService();

export class CategoryController {
    static async handleGetCategories() {
        await rabbitMQService.consumeMessages("get_categories_queue", async (msg, properties) => {
            const replyTo = properties.replyTo || "get_categories_response_queue";
            try {
                const categories = await categoryService.getAllCategories();
                await rabbitMQService.sendMessage(replyTo, categories, { correlationId: properties.correlationId });
            } catch (error : any) {
                await rabbitMQService.sendMessage(replyTo, { error: error.message }, { correlationId: properties.correlationId });
            }
        });
    }

    static async handleCreateCategory() {
        await rabbitMQService.consumeMessages("create_category_queue", async (msg, properties) => {
            const replyTo = properties.replyTo || "create_category_response_queue";
            try {
                const category = await categoryService.createCategory(msg.request);
                await rabbitMQService.sendMessage(replyTo, category, { correlationId: properties.correlationId });
            } catch (error: any) {
                await rabbitMQService.sendMessage(replyTo, { error: error.message }, { correlationId: properties.correlationId });
            }
        });
    }
}