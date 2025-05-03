import redis from "@repo/redis/client";
import axios from "axios";

async function processWithdrawal(){
    while(true){
        try{
            const job = await redis.brPop('withdrawal-queue', 0); // Blocking until a job arrives
            if(job){
                
                const {key, element} = job;
                const data = JSON.parse(element);
                try{
                    const { userId, amount, token, bankProvider } = data;

                    console.log("userId %d amount %d token %s in withdrawal worker", userId, amount, token);
                    const payload = {
                        userId,
                        amount,
                        token
                    }
                    await axios.post('http://localhost:4002/api/bank/initiate', payload);
                }
                catch(error){
                    console.error('Error processing withdrawal job:', error);

                }
            }
           
        }
        catch(error){
            console.error('Error processing withdrawal job:', error);

        }

    }


}



async function startServer(){
    await redis.connect();
    processWithdrawal();
}
startServer();