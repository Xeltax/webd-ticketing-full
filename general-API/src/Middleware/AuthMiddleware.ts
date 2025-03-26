import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config();


const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret";

export const authenticateJWT = (req: any, res: any, next: any) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

        console.log(SECRET_KEY)
    try {
        (req as any).user = jwt.verify(token, SECRET_KEY);
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid Token" });
    }
};
