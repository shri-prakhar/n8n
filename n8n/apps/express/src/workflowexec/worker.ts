    import { prisma } from "@repo/db";
    import { Queue, Worker } from "bullmq";
    import { broadcastMessage } from "./wsServer.js";
    import send_Mail from "./sendemail.js";
    import { Redis } from "ioredis";
import sendTelegram_message from "./sendtelegram.js";
import AI_AGENT from "./AIagentexec.js";

    const connection = new Redis({
        host: "127.0.0.1",
        port: 6379,
         maxRetriesPerRequest: null, 
        });
    console.log("started redis server")
    export const queue = new Queue("workflow-jobs" , {connection})
    


    export const nodeWorker = new Worker("workflow-jobs" , async(job)=>{
        const {executiionId , node , userId } = job.data
        await prisma.nodeExecutions.create({
            data:{
                exection :{
                    connect:{
                        id:executiionId
                    },
                },
                nodeId: node.id,
                type:node.type,
                status:"RUNNING",
                logs:{},
                result:{}
            }
        });
        broadcastMessage({executiionId, nodeId: node.id, status: "RUNNING" });

        try{
            let result = null;
            if (node.type === "Emailnode") {
                
                result = await send_Mail(node , userId)
            } else if (node.type === "Telegramnode") {
                result = await sendTelegram_message(node , userId)
            } else if (node.type === "AIAgentnode") {
                result = await AI_AGENT(node , userId)
            }
            await prisma.nodeExecutions.updateMany({
                where: { executionid: executiionId, nodeId: node.id },
                data: { status: "SUCCESS", result },
            });

        broadcastMessage({ executiionId, nodeId: node.id, status: "SUCCESS", result });
        }catch(err:unknown){
            console.error("Node execution failed:", err);
        if (err instanceof Error) {
        await prisma.nodeExecutions.updateMany({
            where: { executionid: executiionId, nodeId: node.id },
            data: { status: "FAILED", logs: { error: err.message } },
        });

        broadcastMessage({ executiionId, nodeId: node.id, status: "FAILED", error: err.message });
        }
        else{
        console.log("something went wrong")
        }
    } 

    },
    { connection }
    )


nodeWorker.on("completed", (job) => {
  console.log(` Job ${job.id} completed`);
});

nodeWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});
nodeWorker.on("active", job => console.log("Job started", job.id));
nodeWorker.on("stalled", jobId => console.log("Job stalled", jobId));

const waiting = await queue.getWaiting();
const failed = await queue.getFailed();
console.log("Waiting jobs:", waiting.length);
console.log("Failed jobs:", failed.length);
