import { Category } from "../Models/Category";
import prisma from "../../prisma";
import {CategoryDTO} from "../Dtos/CategoryDTO";

export class CategoryRepository {
    async getById(id: string): Promise<Category | null> {
        return prisma.categories.findUnique({ where: { id } });
    }

    async getAll(): Promise<Category[]> {
        return prisma.categories.findMany();
    }

    async save(category: CategoryDTO): Promise<Category> {
        return prisma.categories.create({ data: category });
    }

    async update(data: Category): Promise<Category | null> {
        const id = data.id
        return prisma.categories.update({ where: { id }, data });
    }

    async delete(id: string): Promise<void> {
        await prisma.categories.delete({ where: { id } });
    }
}