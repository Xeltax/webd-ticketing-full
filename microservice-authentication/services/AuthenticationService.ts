import {AuthDTO} from "../Dtos/AuthDTO";
import {hash, compare} from "bcrypt";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export class AuthenticationService {
    async login(credentials: AuthDTO): Promise<{ token: string; user: User }> {
        const user = await userServices.getByEmail(credentials.email);
        if (!user) {
            throw new Error("User does not exist");
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

    // async register(data: UserDTO): Promise<User> {
    //     const existingUser = await userServices.getByEmail(data.email);
    //     if (existingUser) {
    //         throw new Error("User already exists");
    //     }
    //
    //     data.password = await this.hashPassword(data.password);
    //
    //     return await userServices.createUser(data);
    // }
    //
    // async hashPassword(password: string): Promise<string> {
    //     return await hash(password, 10);
    // }
}