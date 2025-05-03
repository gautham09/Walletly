import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';

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
        const payload = await verify(token, JWT_SECRET);
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