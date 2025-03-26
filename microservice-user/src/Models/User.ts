import {Role, Users} from "@prisma/client";

// @ts-ignore
export class User implements Users {
    constructor(
        public id: string,
        public email: string,
        public password: string,
        public createdAt: Date,
        public role: Role,
        public firstName?: string | null,
        public lastName?: string | null,
        public phone?: string | null,
    ) {}
}