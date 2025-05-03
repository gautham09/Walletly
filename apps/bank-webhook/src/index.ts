// import cookieParser from "cookie-parser";
import express from "express";
import { authMiddleware } from "./middlewares/authMiddleware";
import BANK_WEBHOOK_SECRET from "@repo/repo-config/env"; 
import webhookRoute from "./routes/webhookRoute";

const app = express();
app.use(express.json());
// app.use(cookieParser()); 

app.use("/api/walletApp", webhookRoute);

// app.get('/webhook',function(req, res){

//     console.log("webhook secret = ", BANK_WEBHOOK_SECRET)
//     res.send({msg: "webhook called"});
// });

app.listen(4001, function(){console.log("SERVER LISTENING ON PORT 4001")});
