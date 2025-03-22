import { Ticket } from "../Models/Ticket";
import prisma from "../../../prisma";
import {TicketDTO} from "../Dtos/TicketDTO";

export class TicketRepository {
    async getById(id: string): Promise<Ticket | null> {
        return prisma.tickets.findUnique({ where: { id } });
    }

    async getAll(): Promise<Ticket[]> {
        return prisma.tickets.findMany();
    }

    async save(ticket: TicketDTO): Promise<Ticket> {
        return prisma.tickets.create({ data: ticket });
    }

    async update(id: string, data: Partial<TicketDTO>): Promise<Ticket | null> {
        return prisma.tickets.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void> {
        await prisma.tickets.delete({ where: { id } });
    }
}