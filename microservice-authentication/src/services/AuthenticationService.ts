import {AuthDTO} from "../Dtos/AuthDTO";
import {hash, compare} from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import {Category} from "../../../microservice-user/src/Models/Category";
import {UserDTO} from "../../../microservice-user/src/Dtos/CategoryDTO";

dotenv.config();

export class AuthenticationService {
    async login(credentials: AuthDTO, user : Category): Promise<{ token: string; user: Category }> {
        if (!user) {
            throw new Error("Event does not exist");
        }
        
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        // @ts-ignore
        const token = jwt.sign({ email: user.email }, process.env.SECRET_KEY, {
            expiresIn: "1h", // Durée de validité du token
        });

        return { token, user };
    }

    async register(data: UserDTO): Promise<UserDTO> {
        data.password = await this.hashPassword(data.password);

        return data;
    }

    async hashPassword(password: string): Promise<string> {
        return await hash(password, 10);
    }
}