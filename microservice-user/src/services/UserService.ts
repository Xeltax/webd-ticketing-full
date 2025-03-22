import { User } from "../Models/User";
import prisma from "../../../prisma";
import {UserDTO} from "../Dtos/UserDTO";

export class UserRepository {
    async getByEmail(email: string): Promise<User | null> {
        return prisma.users.findUnique({
            where: {email},
        });
    }

    async getAll(): Promise<User[]> {
        return prisma.users.findMany();
    }

    async save(user: UserDTO): Promise<User> {
        return prisma.users.create({
            data: user,
        });
    }

    async update(user: User, data: Partial<UserDTO>): Promise<User | null> {
        const email = user.email;
        return prisma.users.update({
            where: {email},
            data,
        });
    }

    async delete(email: string): Promise<void> {
        await prisma.users.delete({
            where: { email },
        });
    }
}