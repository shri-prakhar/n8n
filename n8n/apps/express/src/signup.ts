import { Request, Response } from "express";
import { signupSchema } from "./validation.js";
import { prisma } from "@repo/db"
import { hashpassword } from "./hash.js";
 
export const signup =  async (req:Request , res: Response)=>{
    try{
        const {email , name  , password }= signupSchema.parse(req.body);

    const existingUser = await prisma.users.findUnique({
        where:{
            email
        }
    });
    
    if (existingUser){
        res.status(400).json({message:"user already exists!!"});
        return 
    }

    const hashedpassword = await hashpassword(password , 8)

    const user = await prisma.users.create({
        data:{
            email,
            name,
            password:hashedpassword
        }
    })

    res.status(200).json({message :"signed up successfully" , user})


}catch(err:unknown){
        if (err instanceof Error){
            res.status(400).json({message:err.message});
        }else {
            console.log("unknown error")
        }
    }};
