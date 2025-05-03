// import { OnRampStatus, PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middlewares/authMiddleware";
import { Response } from "express";
import redis from "@repo/redis/client";
import { v4 as uuidv4 } from 'uuid';
// import {prisma, OnRampStatus} from "@repo/db/client";
import {prisma, OnRampStatus} from '@repo/db/client'



export const createWallet = async (req: AuthRequest, res: Response) => {
    const jwtPayload = req.payload; // Declare and assign jwtPayload
    console.log("JWT Payload: ", jwtPayload);

    if (!jwtPayload || typeof jwtPayload === "string" || !("id" in jwtPayload)) {
         res.status(400).json({ error: "Invalid JWT payload" });
         return;
    }

    // const prisma = new PrismaClient();
    let userWallet = await prisma.wallet.findUnique({
        where: { userId: jwtPayload.id },
    });
    if (userWallet) {
        await prisma.$disconnect();
        res.status(400).json({ error: "Wallet already exists" });
        return;
    }
    
     userWallet = await prisma.wallet.create({ 
        data :{
            userId: jwtPayload.id,
        }
    });
    
    console.log("userWallet", userWallet);

    await prisma.$disconnect();
    // Additional logic for creating a wallet
    res.json({ msg: "Wallet created", walletId: userWallet.id, balance: userWallet.balance });
};

export const getBalance = async (req: AuthRequest, res: Response) => {
    const payload = req.payload;

    console.log("Payload: ", payload);

    if(!payload || typeof payload === "string" || !("id" in payload)) {
        res.status(400).json({ error: "Invalid JWT payload" });
        return;
    }

    // const prisma = new PrismaClient();
    const userWallet = await prisma.wallet.findUnique({
        where: { userId: payload.id }, 
    });

    if(!userWallet) {
        await prisma.$disconnect();
        res.status(400).json({ error: "User not found" });
        return;
    }

    console.log("wallet ", userWallet);

    await prisma.$disconnect();
    res.json({walletId: userWallet.id, balance: userWallet.balance });
};

export const withDrawFromBank = async (req : AuthRequest, res: Response) =>{
    const jwtPayload = req.payload; // Declare and assign jwtPayload

    console.log("JWT Payload: ", jwtPayload);

    if (!jwtPayload || typeof jwtPayload === "string" || !("id" in jwtPayload)) {
         res.status(400).json({ error: "Invalid JWT payload" });
         return;
    }
    const userId = jwtPayload.id;
    const {amount, bankProvider}= req.body;

    let userWallet = await prisma.wallet.findUnique({
        where: { userId: jwtPayload.id },
    });
    if (!userWallet) {
         res.status(404).json({
          error: "Wallet not found for this user. Please set up a wallet before initiating a withdrawal.",
        });
        return;
    }
      

   const token = uuidv4();  // Unique transaction token
   const redisPayload = {
    userId, amount, token, bankProvider
   };
    console.log("pushing into redis", redisPayload);
    const redisPushResult =await redis.lPush('withdrawal-queue', JSON.stringify({ userId, amount, token, bankProvider}));

    const transaction = await prisma.onRampTransaction.create({
        data : {
            userId: userId,
            token: token,
            status: OnRampStatus.Processing,
            provider: bankProvider,
            startTime : new Date(),
            amount: amount
        }
    });  
    res.json({
        message: 'Withdrawal initiated. You will be notified once completed.',
        transactionToken: token,
      });

}


export const onRampTransaction = async (req : AuthRequest, res: Response) =>{
    const jwtPayload = req.payload; // Declare and assign jwtPayload
    console.log(`onRamptransaction`);
    console.log("JWT Payload: ", jwtPayload);

    if (!jwtPayload || typeof jwtPayload === "string" || !("id" in jwtPayload)) {
         res.status(400).json({ error: "Invalid JWT payload" });
         return;
    }
    const userId = jwtPayload.id;
    // const {amount, bankProvider}= req.body;

    let userWallet = await prisma.wallet.findUnique({
        where: { userId: jwtPayload.id },
    });
    if (!userWallet) {
         res.status(404).json({
          error: "Wallet not found for this user. Please set up a wallet before initiating a withdrawal.",
        });
        return;
    }
    try {
        
        const transactions = await prisma.onRampTransaction.findMany({
            where :{
                userId:userId,
            },
            include: { user: true },
            orderBy: { startTime: 'desc' },
        });
    
    
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    
    }

}
