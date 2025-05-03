import { JwtPayload, verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import * as dotenv from 'dotenv';

dotenv.config();


export interface AuthRequest extends Request {
    payload?: JwtPayload | string;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies['token'] || req.headers['authorization'] ?.split(' ')[1];

    console.log("Token: ", token);

    if (!token) {
         res.status(401).json({ error: 'Unauthorized' });
         return;
    }
    try{
        const secretKey = process.env.SECRET_KEY;

if (!secretKey) {
  throw new Error("SECRET_KEY not defined in environment variables");
}


        const payload = await verify(token, secretKey);
        req.payload = payload;
        console.log("Payload: ", payload);    
    }

    catch (error) {
        console.log("Error: ", error);
         res.status(401).json({ error: 'Unauthorized' });
         return;
    }
    
    next();
};