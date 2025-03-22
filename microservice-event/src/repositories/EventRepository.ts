import { Event } from "../Models/Event";
import prisma from "../../../prisma";
import {EventDTO} from "../Dtos/EventDTO";

export class EventRepository {
    async getById(id: string): Promise<Event | null> {
        return prisma.events.findUnique({
            where: {id},
        });
    }

    async getByName(name: string): Promise<Event | null> {
        return prisma.events.findUnique({
            where: {name},
        });
    }

    async getAll(): Promise<Event[]> {
        return prisma.events.findMany();
    }

    async save(event: EventDTO): Promise<Event> {
        return event.events.create({
            data: event,
        });
    }

    async update(event: Event, data: Partial<EventDTO>): Promise<Event | null> {
        const id = event.id;
        return prisma.events.update({
            where: {id},
            data,
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.events.delete({
            where: { id },
        });
    }
}