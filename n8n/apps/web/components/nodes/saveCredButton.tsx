"use client";

import { useState } from "react";
import api from "../../lib/api";
import { useCredentialsformStore, useNodeformStore } from "../globalstateVaribles/Reactflow.ts/ReactflowVariables";

export default function SaveCredButton() {
    const {activeNodeId} = useNodeformStore()
    const {credentialsformdata , saveCredButtonEnable , setcredentialsformopen ,addCredentialOption} = useCredentialsformStore()
  const [loading, setLoading] = useState(false);

  async function handleClickSaveButton() {
    
      try {
        setLoading(true);
        const creds = await api.get("/cred/allCredentials")
        creds.data.creds.forEach((cred: any) => {
            addCredentialOption(cred.title);
        });

        const new_creds =await api.post("/cred/credentials",{
            title:  `${activeNodeId?.toString().split("node")[0]}-${creds.data.creds.length + 1}`,
            platform: `${activeNodeId?.toString().split("node")[0]}`,
            data: credentialsformdata

        }) 
        console.log("succesfully saved the credentials");
        addCredentialOption(new_creds.data.creds.title)
        setcredentialsformopen(false)
        
      } catch (error) {
        console.error("Error saving credentials", error);
      } finally {
        setLoading(false);
      }
    } 

  return (
    <div>
      {saveCredButtonEnable ? (
        <div className="text-gray-500 text-sm font-medium flex items-center gap-1">
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
