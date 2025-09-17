"use client";

import { useState } from "react";
import { useSaveButtonStore } from "./globalstateVaribles/Reactflow.ts/ReactflowVariables";

export default function SaveButton() {
  const { saveWorkflow, saveButtonEnable } = useSaveButtonStore();
  const [loading, setLoading] = useState(false);

  async function handleClickSaveButton() {
    if (saveWorkflow) {
      try {
        setLoading(true);
        await saveWorkflow(); 
        console.log("Triggered saveWorkflow()");
      } catch (error) {
        console.error("Error saving workflow:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.warn("Save function not available yet.");
    }
  }

  return (
    <div>
      {saveButtonEnable ? (
        <div className="text-green-600 text-sm font-medium flex items-center gap-1">
          <span>Saved</span> <span>✔</span>
        </div>
      ) : (
        <button
          onClick={handleClickSaveButton}
          disabled={loading}
          className="px-3 py-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white text-sm rounded flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>Saving...</span>
            </>
          ) : (
            "Save"
          )}
        </button>
      )}
    </div>
  );
}
