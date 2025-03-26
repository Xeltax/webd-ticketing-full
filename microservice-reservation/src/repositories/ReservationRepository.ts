import { Reservation } from "../Models/Reservation";
import prisma from "../../prisma";
import {ReservationDTO} from "../Dtos/ReservationDTO";

export class ReservationRepository {
    async getById(id: string): Promise<Reservation | null> {
        return prisma.reservations.findUnique({
            where: { id },
        });
    }

    async getAll(): Promise<Reservation[]> {
        return prisma.reservations.findMany({
            include: {
                user : true,
                event: {
                    include: {
                        categorie: true, // Inclure la catégorie de l'événement
                        createdBy: true, // Inclure l'utilisateur qui a créé l'événement
                        participants: true, // Inclure les participants
                        tickets: true // Inclure tous les tickets associés
                    }
                },
                ticket: true // Inclure les détails du ticket associé
            }
        });
    }

    async getByUser(userId: string): Promise<Reservation[]> {
        return prisma.reservations.findMany({
            where: { userId },
            include: {
                event: {
                    include: {
                        categorie: true, // Inclure la catégorie de l'événement
                        createdBy: true, // Inclure l'utilisateur qui a créé l'événement
                        participants: true, // Inclure les participants
                        tickets: true // Inclure tous les tickets associés
                    }
                },
                ticket: true // Inclure les détails du ticket associé
            }
        });
    }

    async save(reservation: ReservationDTO): Promise<Reservation> {
        return prisma.reservations.create({
            data: reservation,
        });
    }

    async delete(id: string): Promise<void> {
        await prisma.reservations.delete({
            where: { id },
        });
    }
}