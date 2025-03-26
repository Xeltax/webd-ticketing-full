import {Ticket} from "@/types/ticket";
import {Event} from "@/types/event";

export type Reservation = {
    id: string;
    userId: string;
    eventId: string;
    ticketId: string;
    createdAt: Date;
    event : Event;
    ticket : Ticket;
}