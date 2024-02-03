import express from "express"
import {
    getUser,
    getUserWallets,
    addWallet,
    addTransaction,
    removeTransaction,
    removeWallet,
    getUserTransactions
} from "../controllers/user.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router();

/** READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/transactions", getUserTransactions);
router.get("/:id/wallets", getUserWallets);

/** UPDATE */
router.post("/:id", addTransaction);
router.post("/:id/wallets", addWallet);

/** DELETE */
router.delete("/:id/:trxId", removeTransaction);
router.delete("/:id/wallet", removeWallet);

export default router;