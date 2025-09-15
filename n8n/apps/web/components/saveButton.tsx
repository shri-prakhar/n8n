"use client";

import { useSaveButtonStore } from "./globalstateVaribles/Reactflow.ts/ReactflowVariables";

export default function SaveButton() {
  const { saveWorkflow,saveButtonEnable } = useSaveButtonStore();



 async function handleClickSaveButton() {
  if (saveWorkflow) {
    await saveWorkflow(); // good practice to await async function
    console.log("Triggered saveWorkflow()");
  } else {
    console.warn("Save function not available yet.");
  }
}

  return (
    <div>
      {saveButtonEnable ? (
        <div className="text-gray-300 text-sm ">Saved ✔</div>
      ) : (
        <div>
          <button
            onClick={handleClickSaveButton}
            className="px-2 py-0.5 bg-orange-500 hover:bg-orange-700 text-white text-sm rounded cursor-pointer"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
}
