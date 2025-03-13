import { Router } from "express";
import { BankingAccountController } from "../Controllers/BankingAccountController";
import { authenticateJWT } from "../Middleware/AuthMiddleware";

const router = Router();

router.post("", authenticateJWT, BankingAccountController.createBankingAccount);
router.get("/:userEmail", authenticateJWT, BankingAccountController.getBankingAccount);
router.put("", authenticateJWT, BankingAccountController.updateBankingAccount);
router.delete("", authenticateJWT, BankingAccountController.deleteBankingAccount);

export default router;
