// Models/Category.ts
import { Categories } from "@prisma/client";

export class Category implements Categories {
    constructor(
        public id: string,
        public name: string,
        public color: string
    ) {}
}