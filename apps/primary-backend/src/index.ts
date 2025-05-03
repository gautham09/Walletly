import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoute";
import walletRouter from "./routes/walletRoute";
import redis from "@repo/redis/client";
import cors from "cors"


const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173", // your frontend domain
  credentials: true
}));
app.use(cookieParser()); // Add this line to use cookie-parser middleware
app.use('/api/v1/user', userRouter);
app.use('/api/v1/wallet', walletRouter);

app.get("/", (req, res) => {
  res.send("Hello from primary backend!");
});


async function startServer() {
  await redis.connect();
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

startServer();
