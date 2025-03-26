import { Event } from "../Models/Event";
import prisma from "../../prisma";
import {EventDTO} from "../Dtos/EventDTO";

export class EventRepository {
    async getById(id: string): Promise<Event | null> {
        return prisma.events.findUnique({
            where: { id },
            include: {
                categorie: true, // Charge la catégorie associée
                createdBy: true, // Charge l'utilisateur qui a créé l'événement
                participants: true, // Charge les participants
                tickets: true // Charge les tickets liés à l'événement
            }
        });
    }

    async getByUserId(userId: string): Promise<Event[]> {
        return prisma.events.findMany({
            where: { createdById: userId },
            include: {
                categorie: true, // Charge la catégorie associée
                createdBy: true, // Charge l'utilisateur qui a créé l'événement
                participants: true, // Charge les participants
                tickets: true // Charge les tickets liés à l'événement
            }
        });
    }

    async getByName(name: string): Promise<Event | null> {
        return prisma.events.findUnique({
            where: {name},
            include: {
                categorie: true, // Charge la catégorie associée
                createdBy: true, // Charge l'utilisateur qui a créé l'événement
                participants: true, // Charge les participants
                tickets: true // Charge les tickets liés à l'événement
            }
        });
    }

    async getAll(): Promise<Event[]> {
        return prisma.events.findMany({
            include: {
                categorie: true, // Charge la catégorie associée
                createdBy: true, // Charge l'utilisateur qui a créé l'événement
                participants: true, // Charge les participants
                tickets: true // Charge les tickets liés à l'événement
            }
        });
    }

    async save(event: EventDTO): Promise<Event> {
        console.log(event.createdById)
        return prisma.events.create({
            data: {
                name: event.name,
                description: event.description,
                date: event.date,
                image : event.image,
                bannerUrl : event.bannerUrl,
                location: event.location,
                createdAt: event.createdAt,
                createdBy: { connect: { id: event.createdById } }, // Connexion avec l'utilisateur existant
                categorie: { connect: { id: event.categorieId } }, // Connexion avec la catégorie existante
            },
            include: {
                createdBy: true,
                categorie: true,
                participants: true,
                tickets: true
            }
        });
    }

    async update(id : string, data: Partial<EventDTO>): Promise<Event> {
        return prisma.events.update({
            where: {id},
            include: {
                categorie: true, // Charge la catégorie associée
                createdBy: true, // Charge l'utilisateur qui a créé l'événement
                participants: true, // Charge les participants
                tickets: true // Charge les tickets liés à l'événement
            },
            data: {
                name: data.name,
                description: data.description,
                date: data.date,
                image : data.image,
                bannerUrl : data.bannerUrl,
                location: data.location,
                createdAt: data.createdAt,
                createdBy: { connect: { id: data.createdById } }, // Connexion avec l'utilisateur existant
                categorie: { connect: { id: data.categorieId } }, // Connexion avec la catégorie existante
                tickets: {
                    deleteMany: {}, // Supprime tous les tickets liés à cet event
                    create: data.tickets?.map((ticket: any)  => ({
                        id: ticket.id, // Optionnel si déjà existant
                        name: ticket.name,
                        price: ticket.price
                    })) || []
                }
            },
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.events.delete({
            where: { id },
        });
    }
}