import { Reservations } from "@prisma/client";

export class Reservation implements Reservations {
    constructor(
        public id: string,
        public userId: string,
        public eventId: string,
        public ticketId: string,
        public createdAt: Date
    ) {}
}