import express, { Request ,Response } from "express";
import authRoutes from "./authRoutes.js";
import cookieParser from "cookie-parser";
import credentialsRoutes from "./credentialRoutes.js"

import workflowRoutes from "./workRoutes.js"
import cors from "cors"

const app = express()

app.use(cors({
    origin: "http://localhost:3000",
    credentials:true

}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1" , authRoutes)
app.use("/api/v1" , workflowRoutes)
app.use("/api/v1" , credentialsRoutes)



app.get("/" , (_req :Request , res: Response) => {
    res.json({message: "n8n is running"})
})

app.listen(3030 , () => {
    console.log("server running on port 3030")
})