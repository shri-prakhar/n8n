import { Request, Response } from "express";
import { prisma } from "@repo/db";


export const createWorkflow = async (req: Request, res: Response) => {
  try {
    const { title, enabled, nodes, connections, viewport ,uiState } = req.body;
    const userId = req.user?.id;

    const workflow = await prisma.workflows.create({
      data: {
        title,
        enabled,
        nodes,
        connections,
        viewport,
        uiState,
        user: { connect: { id: userId } },
      },
    });

    res.status(201).json(workflow);
  } catch (error) {
    console.error("Error creating workflow:", error);
    res.status(500).json({ error: "Failed to create workflow" });
  }
};

export const getWorkflows = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const workflows = await prisma.workflows.findMany({
      where:{
        userId:userId
      }
    });
    res.json(workflows);
  } catch (error) {
    console.error("Error fetching workflows:", error);
    res.status(500).json({ error: "Failed to fetch workflows" });
  }
};

export const getWorkflowById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const workflow = await prisma.workflows.findUnique({
      where: { id },
    });

    if (!workflow) {
      return res.status(404).json({ error: "Workflow not found" });
    }

    res.json(workflow);
  } catch (error) {
    console.error("Error fetching workflow:", error);
    res.status(500).json({ error: "Failed to fetch workflow" });
  }
};

export const updateWorkflow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {  nodes, connections,viewport,uiState } = req.body;

    const workflow = await prisma.workflows.update({
      where: { id },
      data: { nodes, connections, viewport , uiState },
    });

    res.json(workflow);
  } catch (error) {
    console.error("Error updating workflow:", error);
    res.status(500).json({ error: "Failed to update workflow" });
  }
};

export const deleteWorkflow = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.workflows.delete({ where: { id } });

    res.json({ message: "Workflow deleted successfully" });
  } catch (error) {
    console.error("Error deleting workflow:", error);
    res.status(500).json({ error: "Failed to delete workflow" });
  }
};
