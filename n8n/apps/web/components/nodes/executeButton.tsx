"use client";

import { useState } from "react";
import { useSaveButtonStore } from "../globalstateVaribles/Reactflow.ts/ReactflowVariables";
import api from "../../lib/api"; 

export default function ExecuteWorkflowButton({ workflowId }: { workflowId: string }) {
  const { saveWorkflow } = useSaveButtonStore();
  const [loading, setLoading] = useState(false);
  const [executed, setExecuted] = useState(false);

  async function handleExecuteWorkflow() {
    if (!saveWorkflow) {
      console.warn("Save function not available yet.");
      return;
    }

    try {
      setLoading(true);
      setExecuted(false);


      await saveWorkflow();
      console.log("Workflow saved successfully ✅");

      const res = await api.post(`/execute/${workflowId}`);
      console.log("Execution started:", res.data);

     // setExecuted(true);
    } catch (error: any) {
      console.error("Error executing workflow:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="position absolute left-190 bottom-10">
    <button
      onClick={handleExecuteWorkflow}
      disabled={loading || executed} 
      className="px-2.5 py-2.5 px-10 font-sans font-medium bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed 
                 text-white text-md rounded-md flex items-center justify-center gap-2 transition cursor-pointer"
    >

      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>Executing Workflow...</span>
        </>
      ) : executed ? (
        "Execution started ✔"
      ) : (
        "Execute Workflow"
      )}
    </button>
    </div>
  );
}
