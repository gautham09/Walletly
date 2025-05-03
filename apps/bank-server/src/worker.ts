// worker.ts
import axios from 'axios';
import { transactionQueue } from './queue';
import BANK_WEBHOOK_SECRET from "@repo/repo-config/env"; 
import crypto from 'crypto';



const WEBHOOK_URL = 'http://localhost:4001/api/walletApp/webhook'; // Replace with your real webhook URL

const signPayload = (payload: object): string => {
    // Convert the payload into a string format (JSON)
    const payloadString = JSON.stringify(payload);
  
    // Create HMAC with SHA256 hashing algorithm and sign the payload
    const signature = crypto
      .createHmac('sha256', BANK_WEBHOOK_SECRET)
      .update(payloadString)
      .digest('hex'); // Returns a hexadecimal digest
  
    return signature;
  };
  

const processQueue = async () => {
    console.log("NEW QUEUE JOB STARTED");
  while (transactionQueue.length > 0) {
    const txn = transactionQueue.shift();

    if (txn) {
       const payload =  {
            token: txn.token,
            userId: txn.userId,
            amount: txn.amount,
          };
          const signature = signPayload(payload);

      try {
        console.log("signature ",signature);
        const response = await axios.post(WEBHOOK_URL,payload, {
            headers: {
              'Content-Type': 'application/json',
              'X-Signature': signature, // Custom header to carry signature
            },
          });
        console.log(`✅ Webhook hit for token ${txn.token}`, response.data);
      } catch (error) {
        if (error instanceof Error) {
          console.error(`❌ Failed webhook for token ${txn.token}`, error.message);
        } else {
          console.error(`❌ Failed webhook for token ${txn.token}`, error);
        }
      }
    }
  }
};

// Trigger every 10 seconds
setInterval(processQueue, 60000);
