import { prisma } from "@repo/db";
import { Request,Response } from "express";
import Traversegraph from "./graphtraversasl.js";
import Startexecution from "./startexecution.js";


export async function executeWorkflow(req:Request , res: Response){
    try{
        const { workflowId } = req.params;
        const userId = req.user?.id;

        console.log("workflow reached till here 1")

        const Workflow = await prisma.workflows.findUnique({
            where:{
                id: workflowId,
                userId
            }
        })

        if (!Workflow){
            res.status(400).json({Error:"Workflow not found"});
            return 
        }

       
        if (Array.isArray(Workflow.nodes) && Workflow.nodes.find((n:any)=>
            n.type === "ManualTriggernode"
        )){
            console.log("workflow reached till here 2")
            const execution = await Startexecution(Workflow)
            console.log("workflow reached till here 3")
            await Traversegraph(Workflow , execution.id )
        }
        else if (Array.isArray(Workflow.nodes) && Workflow.nodes.find((n:any)=>
            n.type === "Webhooknode"
        )){
            console.log("waiting for the webhook call")
        }else{

            res.status(400).json({error:"No trigger found"})
            return
        }
        res.status(200).json({message:"done"})
            


    }catch(e:unknown){
        console.error(e)
        res.status(500).json({error:"Workflow execution failed"})
    }
}