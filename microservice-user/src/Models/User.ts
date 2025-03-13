import { Users } from "@prisma/client";

export class User implements Users {
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public phone: string | null,
        public password: string,
        public createdAt: Date,
    ) {}
}