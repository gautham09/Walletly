import { Router } from "express";
import { v4 as uuidv4 } from 'uuid';
import  {transactionQueue, Transaction } from "../queue";


// type Transaction = {
//     userId: number;
//     amount: number;
//     token: string;
//   };
  
//   const transactionQueue: Transaction[] = [];
const transactionRoute = Router();

transactionRoute.get('/', (req, res) => {
    // registerUser(req, res);
    res.json({ "msg": "HIT the transaction route" });
}
);

transactionRoute.post('/initiate', (req, res)=>{
    try {
        
        const { userId, amount, token } = req.body;

    
        // const token = uuidv4(); // This will act like our transaction token
        if (!userId || !amount || typeof amount !== 'number') {
            res.status(400).json({ error: 'Invalid or missing userId or amount' });
            return;
          }
          const newTransaction: Transaction = { userId, amount, token };
          console.log("transaction being pushed into bank queue ", newTransaction);
          transactionQueue.push(newTransaction);        
          res.json({ token: token });
    } catch (error) {
        console.error("Transaction initiation failed:", error);
        res.status(500).json({ error: 'Internal server error while initiating transaction' });
    }

});

export default transactionRoute;