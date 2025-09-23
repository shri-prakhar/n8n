import { prisma } from "@repo/db";
import { Request, Response } from "express";
import Startexecution from "./startexecution.js";
import Traversegraph from "./graphtraversasl.js";


export default async function WebhookHandler (req:Request, res:Response){
    try{
            const { workflowId } = req.params;

        const workflow = await prisma.workflows.findUnique({
            where:{
                id: workflowId
            }
        })

        if (!workflow){
            res.status(400).json({error:"wprkflow not found "})
            return
        }
        const execution = await Startexecution(workflow)
        await Traversegraph(workflow, execution.id);

        res.status(200).json({Message: "webook registered successfully"})

    }catch(e:unknown){
        console.error(e)
        res.status(500).json({error:"Webhook not registered"})
            
    }

}