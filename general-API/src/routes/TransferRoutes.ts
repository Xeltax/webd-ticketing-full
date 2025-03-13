import { Router } from "express";
import { TransferController } from "../Controllers/TransferController";
import { authenticateJWT } from "../Middleware/AuthMiddleware";

const router = Router();

router.post("", authenticateJWT, TransferController.transfer);
router.post("/deposit", authenticateJWT, TransferController.deposit);
router.get("/:bankAccountId", authenticateJWT, TransferController.getTransfers);

export default router;