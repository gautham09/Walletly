import express from "express";
import './worker'; 
import crypto from "crypto";
import transactionRoute from "./routes/transactionRoutes";


const app = express();
app.use(express.json());
app.use('/api/bank', transactionRoute);
app.get('/', (req, res) => {
    res.send({msg: "hit the bank server"})
})

app.listen(4002, ()=>{
    console.log("BANK SERVER RUNNING ON PORT 4000");
})