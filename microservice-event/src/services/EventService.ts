import {EventRepository} from "../repositories/EventRepository";
import {EventDTO} from "../Dtos/EventDTO";
import {Event} from "../Models/Event";

export class EventService {
    private eventRepository: EventRepository = new EventRepository();

    async createEvent(data: EventDTO): Promise<Event> {
        console.log("Creating event with data:", data.name);
        const existingEvent = await this.eventRepository.getByName(data.name);
        if (existingEvent) {
            throw new Error("Event already exists");
        }

        return await this.eventRepository.save(data);
    }

    async getAllEvents(): Promise<Event[]> {
        return await this.eventRepository.getAll();
    }

    async getById(id: string): Promise<Event | null> {
        return await this.eventRepository.getById(id);
    }

    async getEventsByUserId(userId: string): Promise<Event[]> {
        return await this.eventRepository.getByUserId(userId);
    }

    async updateEventById(id: string, data: EventDTO): Promise<Event> {
        const existingEvent = await this.eventRepository.getById(id);
        if (!existingEvent) {
            throw new Error("Event not found");
        }

        console.log("Updating event with data:", data);

        return await this.eventRepository.update(id, data);
    }

    async deleteEventsById(id: string): Promise<void> {
        await this.eventRepository.delete(id);
    }
}