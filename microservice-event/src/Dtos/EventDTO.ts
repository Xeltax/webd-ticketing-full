export type EventDTO = {
    name: string,
    description: string,
    date: Date,
    image : string,
    bannerUrl : string[],
    location: string,
    category: string,
    tickets : any,
    createdAt: Date,
    createdById : string,
    categorieId: string
}