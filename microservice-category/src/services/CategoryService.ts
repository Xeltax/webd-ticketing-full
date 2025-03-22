import { CategoryRepository } from "../Repositories/CategoryRepository";
import { CategoryDTO } from "../Dtos/CategoryDTO";

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

    async updateCategory(id: string, data: Partial<CategoryDTO>) {
        return this.categoryRepository.update(id, data);
    }

    async deleteCategory(id: string) {
        return this.categoryRepository.delete(id);
    }
}