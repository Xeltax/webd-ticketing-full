import { Users } from "@prisma/client";

export class User implements Users {
    constructor(
        public email: string,
        public password: string,
        public createdAt: Date,
        public firstName?: string | null,
        public lastName?: string | null,
        public phone?: string | null,
    ) {}
}