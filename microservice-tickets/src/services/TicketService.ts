import { TicketRepository } from "../Repositories/TicketRepository";
import {TicketDTO} from "../Dtos/TicketDTO";


export class TicketService {
    private ticketRepository = new TicketRepository();

    async getAllTickets() {
        return this.ticketRepository.getAll();
    }

    async getTicketById(id: string) {
        return this.ticketRepository.getById(id);
    }

    async createTicket(data: TicketDTO) {
        return this.ticketRepository.save(data);
    }

    async updateTicket(id: string, data: Partial<TicketDTO>) {
        return this.ticketRepository.update(id, data);
    }

    async deleteTicket(id: string) {
        return this.ticketRepository.delete(id);
    }
}
