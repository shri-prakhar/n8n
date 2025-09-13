import { NextFunction, Request , Response } from "express";
import { decodetoken } from "../jwt.js";
import { prisma } from "@repo/db";

export const verify = async (req:Request , res:Response , next: NextFunction )=> {
    try{
        const token =  req.cookies.token

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    const decoded = decodetoken(token);

    console.log(decoded) 

    const user = await prisma.users.findUnique({
        where:{
            id: decoded
        }
    })

    if (!user) {
        throw new Error("Authentication failed")
    }

    req.body.user = {id : user.id}
    next();
}catch(err:unknown){
    if (err instanceof Error){
        res.status(401).json({message: err.message})
    }else{
        console.log("unknoen error")
    }
}
} 