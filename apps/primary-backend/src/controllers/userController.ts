// import { PrismaClient } from '@prisma/client';
import {prisma, OnRampStatus} from '@repo/db/client'
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { JWT_SECRET, SALT_ROUNDS, STATIC_SALT } from '../config';
import { sign } from 'jsonwebtoken';
import { AuthRequest } from "../middlewares/authMiddleware";



export const registerUser = async (req: Request, res: Response) => {
    const data = req.body;
    const { email, password, name } = req.body;


    // Check if user with the given email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if (existingUser) {
        await prisma.$disconnect();
        return res.status(400).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password + STATIC_SALT, SALT_ROUNDS);

    const User = await prisma.user.create({
        data: {
            email: email,
            password: hashedPassword,
            name: name,
        }
    });


    console.log("User created: ", User);

    let userWallet = await prisma.wallet.create({ 
        data :{
            userId: User.id,
        }
    });
    
    console.log("userWallet", userWallet);

    const jwt = await sign({ id: User.id, name: name }, JWT_SECRET, { expiresIn: '1h' });

    await prisma.$disconnect();
    res.status(201).cookie('token', jwt, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax'
    }).json({ jwt: jwt, name: User.name, id: User.id, email: User.email}); 
}

export const loginUser = async (req: Request, res: Response) => {
    const data = req.body;
    const { email, password } = req.body;

    // Check if user with the given email exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email }
    });

    if (!existingUser) {
        await prisma.$disconnect();
        return res.status(400).json({ error: 'User not found' });
    }

    console.log("existingUser: ", existingUser);

    const matched = await bcrypt.compare(password + STATIC_SALT, existingUser.password);
    console.log("Password matched", matched);

    if (!matched) {
        await prisma.$disconnect();
        return res.status(400).json({ error: 'Invalid password' });
    }

    const jwt = await sign({ id: existingUser.id, name: existingUser.name }, JWT_SECRET);
    
    console.log("JWT: ", jwt);
    res.status(200).cookie('token', jwt, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        // maxAge: 1000 * 60 * 60 //1hr
    }).json({ jwt: jwt, name: existingUser.name, id: existingUser.id, email: existingUser.email}); // Send the JSON response with the JWT

    await prisma.$disconnect();
}

export const logoutUser = async(req: Request, res: Response) => {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',             
    })
    .status(204)  
    .send();
}

export const userDetails = async (req: AuthRequest, res: Response) => {
    const jwtPayload = req.payload; // Declare and assign jwtPayload

    console.log("JWT Payload: ", jwtPayload);

    if (!jwtPayload || typeof jwtPayload === "string" || !("id" in jwtPayload)) {
         res.status(400).json({ error: "Invalid JWT payload" });
         return;
    }
    const userId = jwtPayload.id;

    // Check if user with the given email already exists
    const existingUser = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (existingUser) {
        await prisma.$disconnect();
         res.json({ name: existingUser.name, id: existingUser.id, email: existingUser.email });
         return;
    }

    
    



}
