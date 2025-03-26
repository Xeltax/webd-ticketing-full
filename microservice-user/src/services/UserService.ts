import {UserRepository} from "../repositories/UserRepository";
import {UserDTO} from "../Dtos/UserDTO";
import {User} from "../Models/User";

export class UserService {
    private userRepository: UserRepository = new UserRepository();

    async createUser(data: UserDTO): Promise<User> {
        console.log("Creating user with data:", data.email);
        const existingUser = await this.userRepository.getByEmail(data.email);
        if (existingUser) {
            throw new Error("User already exists");
        }

        return await this.userRepository.save(data);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.userRepository.getAll();
    }

    async getByEmail(email: string): Promise<User | null> {
        return await this.userRepository.getByEmail(email);
    }

    async getById(id: string): Promise<User | null> {
        return await this.userRepository.getById(id);
    }

    async updateUser(user: User, data: Partial<UserDTO>): Promise<User | null> {
        console.log("Updating user with data:", data);
        console.log("User:", user);
        return await this.userRepository.update(user, data);
    }

    async deleteUser(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }
}