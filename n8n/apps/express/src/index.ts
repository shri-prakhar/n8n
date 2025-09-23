import express, { Request ,Response } from "express";
import authRoutes from "./authRoutes.js";
import cookieParser from "cookie-parser";
import credentialsRoutes from "./credentialRoutes.js"
 import workflowexecRoutes from "./workflowexecRoute.js"

import workflowRoutes from "./workRoutes.js"
import cors from "cors"
import { startWebsocketserver } from "./workflowexec/wsServer.js";

import {Redis} from "ioredis";
import { Queue  } from "bullmq";
import dotenv from "dotenv"


const app = express()
startWebsocketserver()
dotenv.config()
 



// export async function EnqueQueueJob( Payload:any = {}) {
//     return queue.add("workflow-jobs"  , Payload , {attempts:3, backoff:{type:"exponential",delay:1000} ,removeOnComplete :true , removeOnFail:false} );
// }

const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.1.162:3000", 
  "http://127.0.0.1:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); 
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }))
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1" , authRoutes)
app.use("/api/v1/cred" , credentialsRoutes)
app.use("/api/v1" , workflowRoutes)
 app.use("/api/v1" , workflowexecRoutes)




app.get("/" , (_req :Request , res: Response) => {
    res.json({message: "n8n is running"})
})

app.listen(3030 , () => {
    console.log("server running on port 3030")
})