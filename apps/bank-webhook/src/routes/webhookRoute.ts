import { Router } from "express";
import crypto from "crypto";
import BANK_WEBHOOK_SECRET from "@repo/repo-config/env"
import { prisma, OnRampStatus } from "@repo/db/client";

const webhookRoute = Router();

const verifyPayload = (payload: object, signature: string): boolean => {
    // Convert the payload into a string format (JSON)
    const payloadString = JSON.stringify(payload);

    console.log("PAYLOAD :", payloadString);
  
    // Create the signature using the same algorithm and secret key
    const expectedSignature = crypto
      .createHmac('sha256', BANK_WEBHOOK_SECRET)
      .update(payloadString)
      .digest('hex');
  
    // Compare the received signature with the expected signature
    return expectedSignature === signature;
  };

webhookRoute.get('/', (req, res)=>{
    console.log("HELLO");
    res.send({msg: "webhook-server"})
});

webhookRoute.post('/webhook', async(req, res) =>{
    const receivedSignature = req.headers['x-signature'] as string;

    const payload = req.body;
    console.log("payload revieved in webhook ", payload);
    if (!verifyPayload(payload, receivedSignature)) {
        console.log('Invalid Signature');
        res.status(400).send('Invalid webhook data');
        return;
      } 
    else console.log('valid Signature');
    res.status(200).send("valid webhook");
    const {token, userId, amount} = payload;
    
    await prisma.$transaction([
        prisma.onRampTransaction.update({
          where: { token },
          data: { status: OnRampStatus.Success },
        }),
      
        prisma.wallet.update({
          where: { userId },
          data: {
            balance: {
              increment: amount,
            },
          },
        }),
      ]);      
});

export default webhookRoute;