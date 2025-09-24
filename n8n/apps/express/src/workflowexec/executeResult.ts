// import { prisma } from "@repo/db";
// import { Request , Response } from "express"


// export const getallExecutions = async (req:Request , res:Response) => {

//     console.log("req recd")
//     try{
//     const userId = req.user?.id;

//     // const creds = await prisma.nodeExecutions.findMany({
//         where:{
            
//         }
//     })

//     res.status(200).json({creds})
// }catch(error:unknown){
//     console.log(error)
//     res.status(404).json({Message: "Auth failed"})
// }

// }


// export const deleteExecutions = async (req:Request , res:Response) => {
//     try{
//     const { id } = req.body;

//     await prisma.nodeExecutions.delete({
//         where:{
//             id
//         }
//     })

//     res.status(200).json({Message:"Deleted Successfully"})
// }catch(error:unknown){
//     console.log(error)
//     res.status(404).json({Message: "Invalid Executions"})
// }

// }