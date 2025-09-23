import { prisma } from "@repo/db";

export default async function Startexecution(workflow:any){
     const execution = await prisma.workflowExecutions.create({
                
                data:{
                    workflow : {
                        connect:{ id: workflow.id
                        }
                    },
                    status : "RUNNING",
                    logs:{},
                    results:{}
                },
            })
    return execution
}