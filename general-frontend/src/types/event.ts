import {Ticket} from "@/types/ticket";
import {Categories} from "@/types/categories";

export type Event = {
    id? : string,
    name: string,
    description: string,
    date: Date,
    image : string,
    bannerUrl : string[],
    location: string,
    createdBy : any,
    participants : any,
    categorie? : Categories,
    tickets : Ticket[],
    createdAt: Date,
    createdById : string,
    categorieId: string
}