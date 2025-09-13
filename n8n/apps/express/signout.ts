import { Request , Response } from "express"


export const signout  = async (req:Request , res:Response) =>{
    try{
        res.clearCookie("token");
        res.status(200).json({message: "logged out "})
    }catch(e:unknown){
        console.error(e)
    }
}