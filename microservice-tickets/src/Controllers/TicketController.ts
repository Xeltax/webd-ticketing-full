// Controllers/TicketController.ts
import { TicketService } from "../services/TicketService";
import { rabbitMQService } from "../services/rabbitmqService";

const ticketService = new TicketService();

export class TicketController {
    static async handleGetTickets() {
        await rabbitMQService.consumeMessages("get_tickets_queue", async (msg, properties) => {
            const replyTo = properties.replyTo || "get_tickets_response_queue";
            try {
                const tickets = await ticketService.getAllTickets();
                await rabbitMQService.sendMessage(replyTo, tickets, { correlationId: properties.correlationId });
            } catch (error : any) {
                await rabbitMQService.sendMessage(replyTo, { error: error.message }, { correlationId: properties.correlationId });
            }
        });
    }

    static async handleCreateTicket() {
        await rabbitMQService.consumeMessages("create_ticket_queue", async (msg, properties) => {
            const replyTo = properties.replyTo || "create_ticket_response_queue";
            try {
                const ticket = await ticketService.createTicket(msg.request);
                await rabbitMQService.sendMessage(replyTo, ticket, { correlationId: properties.correlationId });
            } catch (error : any) {
                await rabbitMQService.sendMessage(replyTo, { error: error.message }, { correlationId: properties.correlationId });
            }
        });
    }
}
