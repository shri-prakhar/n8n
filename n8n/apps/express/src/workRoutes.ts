import { Router } from "express";
import {
  createWorkflow,
  getWorkflows,
  getWorkflowById,
  updateWorkflow,
  deleteWorkflow,
} from "./workflow.js";
import { verify } from "./middlewares/verify.js";

const router:Router = Router();

router.post("/workflow",verify, createWorkflow);
router.get("/workflows", verify,getWorkflows);
router.get("/:id",verify, getWorkflowById);
router.put("/:id", verify, updateWorkflow);
router.delete("/:id", verify,deleteWorkflow);

export default router;
