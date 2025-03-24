import { Reservation } from "../Models/Reservation";
import prisma from "../../../prisma";
import {ReservationDTO} from "../Dtos/ReservationDTO";

export class ReservationRepository {
    async getById(id: string): Promise<Reservation | null> {
        return prisma.reservations.findUnique({
            where: { id },
        });
    }

    async getAll(): Promise<Reservation[]> {
        return prisma.reservations.findMany();
    }

    async getByUser(userId: string): Promise<Reservation[]> {
        return prisma.reservations.findMany({
            where: { userId },
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