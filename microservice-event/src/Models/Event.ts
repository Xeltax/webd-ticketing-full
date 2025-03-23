import { Events } from "@prisma/client";

export class Event implements Events {
    constructor(
        public id : string,
        public name: string,
        public description: string,
        public date: Date,
        public image : string,
        public bannerUrl : string[],
        public location: string,
        public createdBy : any,
        public participants : any,
        public categorie : any,
        public tickets : any,
        public createdAt: Date,
        public createdById : string,
        public categorieId: string
    ) {}
}