import {AuthenticationService} from "../services/AuthenticationService";

const authService : AuthenticationService = new AuthenticationService();

export class AuthenticationController {

    static async login(req: Request, res: Response) {
        try {
            const user = await authService.login(req.body);
            res.json(user);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    // static async register(req: Request, res: Response) {
    //     try {
    //         const user = await authService.register(req.body);
    //         sendMail("Bienvenue sur notre application bancaire", `Vous avez bien été enregistré ${user.email}`);
    //         res.json(user);
    //     } catch (error: any) {
    //         res.status(400).json({ error: error.message });
    //     }
    // }
    //
    // static async logout(req: Request, res: Response) {
    //     try {
    //         res.json("Successfully logged out");
    //     } catch (error: any) {
    //         res.status(400).json({ error: error.message });
    //     }
    // }
}