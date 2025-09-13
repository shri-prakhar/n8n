import { prisma } from "@repo/db";
import { Request , Response } from "express"

export const Credentials = async (req:Request , res:Response) => {
    try{
    const { title ,  platform , data } = req.body;
    const { id: userId } = req.body.user

    const creds = await prisma.credentials.create({
        data:{
            title,
            platform,
            data,
            user: { connect: { id : userId} }
        }
    })

    res.status(200).json({creds})
}catch(error:unknown){
    console.log(error)
    res.status(404).json({Message: "Invalid Credentials"})
}

}


export const deleteCredentials = async (req:Request , res:Response) => {
    try{
    const { id } = req.body;

    await prisma.credentials.delete({
        where:{
            id
        }
    })

    res.status(200).json({Message:"Deleted Successfully"})
}catch(error:unknown){
    console.log(error)
    res.status(404).json({Message: "Invalid Credentials"})
}

}