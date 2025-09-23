import { Router } from "express";
import { verify } from "./middlewares/verify.js";
import { executeWorkflow } from "./workflowexec/executeController.js";
import WebhookHandler from "./workflowexec/webhookHandler.js";


const router:Router = Router();

router.post("/execute/:workflowId" , verify , executeWorkflow);
router.post("/webhook/:workflowId" , WebhookHandler);


export default router