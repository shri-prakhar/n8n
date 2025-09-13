import { Request, Response } from "express";
import { signinSchema } from "./validation.js";
import { prisma } from "@repo/db";
import { comparepassword } from "./hash.js";
import { generatetoken } from "./jwt.js";

export const signin = async (req:Request , res: Response )=> {
   try{
     const {email , password } = signinSchema.parse(req.body);

    const user  = await prisma.users.findUnique({
        where:{
            email
        }
    });

    if (!user || !user.password) {
        throw new Error("Invalid Credentials")
    }

    const compare = await comparepassword(password , user.password)

    if (!compare){
        throw new Error("Invalid Password")
    }

    const token = generatetoken(user.id);

    res.cookie("token" , token ,{
        httpOnly:true,
        secure:false,
        sameSite: "lax"
    }).status(200).json({user});


   }catch(err:unknown){

     if (err instanceof Error){
            res.status(400).json({message:err.message});
        }else {
            console.log("unknown error")
        }
    }};