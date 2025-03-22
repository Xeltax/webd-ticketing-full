import { Tickets } from "@prisma/client";

export class Ticket implements Tickets {
    constructor(
        public id: string,
        public name: string,
        public price: number,
        public eventId: string
    ) {}
}
