import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { createWallet, getBalance, onRampTransaction, withDrawFromBank } from "../controllers/walletController";


const walletRouter = Router();``

walletRouter.get('/balance',authMiddleware, getBalance);

walletRouter.post('/create',authMiddleware, createWallet);

walletRouter.post('/withdraw',authMiddleware, withDrawFromBank);

walletRouter.get('/transactions', authMiddleware, onRampTransaction);

walletRouter.get('/',authMiddleware, (req, res) => {
    res.json({ "msg": "HELLO" }); });


export default walletRouter;