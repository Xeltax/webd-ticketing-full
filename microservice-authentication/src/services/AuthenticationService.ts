import {AuthDTO} from "../Dtos/AuthDTO";
import {hash, compare} from "bcryptjs";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export class AuthenticationService {
    async login(credentials: AuthDTO, user : any): Promise<{ token: string; user: any }> {
        if (!user) {
            throw new Error("Event does not exist");
        }
        
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret";

        console.log(SECRET_KEY)

        // @ts-ignore
        const token = jwt.sign({ email: user.email, id : user.id, role : user.role }, SECRET_KEY, {
            expiresIn: "1h", // Durée de validité du token
        });

        return { token, user };
    }

    async register(data: any): Promise<any> {
        data.password = await this.hashPassword(data.password);

        return data;
    }

    async hashPassword(password: string): Promise<string> {
        return await hash(password, 10);
    }
}