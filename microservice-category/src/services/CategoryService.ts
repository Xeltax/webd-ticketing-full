import { CategoryRepository } from "../repositories/CategoryRepository";
import { CategoryDTO } from "../Dtos/CategoryDTO";
import {Category} from "../Models/Category";

export class CategoryService {
    private categoryRepository = new CategoryRepository();

    async getAllCategories() {
        return this.categoryRepository.getAll();
    }

    async getCategoryById(id: string) {
        return this.categoryRepository.getById(id);
    }

    async createCategory(data: CategoryDTO) {
        return this.categoryRepository.save(data);
    }

    async updateCategory(id: string, data: Category) {
        console.log("Updating category with id", id, "and data", data);
        return this.categoryRepository.update(data);
    }

    async deleteCategory(id: string) {
        return this.categoryRepository.delete(id);
    }
}