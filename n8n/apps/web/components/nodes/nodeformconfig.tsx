
"use client";
import { Bot, Code2, Mail, WebhookIcon } from "lucide-react";
import { credSchemas } from "../globalstateVaribles/credformschema";
import { useCredentialsformStore, useNodeformStore, useNodeOutputstore, useSaveButtonStore } from "../globalstateVaribles/Reactflow.ts/ReactflowVariables";
import { FaTelegramPlane } from "react-icons/fa";
import api from "../../lib/api";
import { useEffect } from "react";


export default function NodeConfigForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const { formOpen, setformopen, formSchema, formdata, setformdata ,activeNodeId } = useNodeformStore();
  const {setcredentialsformopen, setcredentialsformSchema,credentialsOptions,addCredentialOption }=useCredentialsformStore()
  const { nodeOutputs } = useNodeOutputstore();
    const nodeOutput = nodeOutputs[activeNodeId || ""] || {};
    console.log(nodeOutputs)
  
  const {saveButtonEnable , setSaveButtonEnable}=useSaveButtonStore()
  useEffect(() => {
    console.log("cred was called")
     async function creds(){ 
       const cred =  await api.get("/cred/allCredentials")
        cred.data.creds.forEach((cred: any) => {
            addCredentialOption(cred.title);
        });
    }
    creds()

  },[])

  if (!formOpen) return null;
  const renderIcon = () => {
  const type = activeNodeId?.toString().split("node")[0];

  if (type === "Email") return <span><Mail /></span>;
  if (type === "Telegram") return <span><FaTelegramPlane /></span>;
  if (type === "AIAgent") return <span><Bot /></span>;
  if (type === "Webhook") return <span><WebhookIcon /></span>;
  if (type === "Tool") return <span><Code2 /></span>;

  return null; 
};

  const handleChange = (name: string, value: any) => {
    if (name === "credentials" && value === "Create new credentials") {
      setcredentialsformopen(true);
        const type = activeNodeId?.split("-")[0] || "y"
        const schema = credSchemas[type] || [
        { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
        ];
        setcredentialsformSchema(schema)
    
    } else {
      
      setformdata({ ...formdata, [name]: value });
    }
  };

  const handleSubmit = () => {
    onSubmit(formdata);
    setformopen(false);
    if(saveButtonEnable){
        setSaveButtonEnable(false)
    }
  };

  return (
    <div className="position absolute bg-[#4d3e3d]/70 z-10 inset-0 flex">
        <div className="fixed top-12 left-5 text-white font-bold p-3 text-xl w-140 h-155 bg-[#2d2e2e] items-center z-20 overflow-y-auto">
            <div className="mb-3">Input</div> 

            <div className="space-y-3">
                {Object.entries(formdata).map(([key, value]) => (
                <div 
                    key={key} 
                    className="p-4 rounded-xl border border-gray-600 bg-[#1e1e1e] shadow-md"
                >
                    <div className="text-sm font-semibold text-gray-200 mb-1">{key}</div>
                    <div className="text-sm text-gray-400 break-words">{String(value)}</div>
                </div>
                ))}
            </div>
            </div>

        
        <div className="fixed top-12 left-147 w-90 h-155 bg-[#2d2e2e] flex justify-center items-center z-20">
            <div className="w-350 h-170 bg-[#414245] rounded-xl shadow-lg w-[380px]">
            <div className="text-white mb-4 text-lg font-sans font-semibold w-full flex justify-between p-4 pb-10 px-5 bg-[#525456] shadow-md">
                
                <div className="flex items-center gap-2">
                    <div>{renderIcon()}</div>
                        <div>{activeNodeId?.toString().split("node")[0]}</div>   
                    </div>
                
                
                <button
                    className="px-4 py-1 bg-orange-500 rounded text text-sm text-white hover:bg-orange-600 cursor-pointer"
                    onClick={handleSubmit}
                >
                    Execute Step
                </button>
            </div>
            <div className="position fixed top-18 left-148 text-sm px-4 pb-2 text-orange-500 font-bold font-sans text-orange border-b-2  border-orange-500"> 
                Parameters
            </div>
            <div>
                <form className="flex flex-col gap-4 px-4">
                    {formSchema.map((field, idx) => (
                        <div key={idx} className="flex flex-col">
                            <label className="text-xs text-white mb-1">{field.label}</label>
                           {field.type === "select" ? (
                                <select
                                    className="p-0.5 rounded bg-[#2a2a2a] text-gray-400 text-sm"
                                    value={formdata[field.name] || ""}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                >
                                    <option value="" disabled selected>
                                    {field.placeholder}
                                    </option>

                                    {field.name === "credentials" &&
                                    credentialsOptions.map((opt, i) => (
                                        <option key={i} value={opt}>
                                        {opt}
                                        </option>
                                    ))}

                                    {field.name === "credentials" && (
                                    <option value="Create new credentials">Create new credentials</option>
                                    )}

                                    {field.name !== "credentials" &&
                                    field.options?.map((opt, i) => (
                                        <option key={i} value={opt}>
                                        {opt}
                                        </option>
                                    ))}
                                </select>

                            ) : field.type === "textarea" ? (
                                <textarea
                                    className="p-5 rounded bg-[#2a2a2a] text-white text-sm"
                                    value={formdata[field.name] || ""}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    className="px-3 p-0.5 rounded bg-[#2a2a2a] text-white"
                                    value={formdata[field.name] || ""}
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                />
                            )}
                        </div>
                    ))}
                </form>
                <div className="flex justify-end gap-2 mt-4 px-4">
                    <button
                        className="px-4 py-1 bg-gray-600 rounded text-white hover:bg-gray-500 cursor-pointer"
                        onClick={() => setformopen(false)}
                    >
                        Cancel
                    </button>
                    
                </div>
            </div>
        </div>
        </div>
        <div className="fixed top-12 right-5 text-white font-bold p-3 text-xl  w-140 h-155 bg-[#2d2e2e] items-center z-20">
             <div className="mb-3">Output</div>

                {nodeOutput.status ? (
                    <div className="space-y-3">
                    <div className="p-3 rounded bg-[#1e1e1e] border border-gray-600">
                        <div className="text-sm text-gray-400">Status</div>
                        <div className="text-green-400">{nodeOutput.status}</div>
                    </div>
                        {nodeOutput.result && (
                            <div className="p-3 rounded bg-[#1e1e1e] border border-gray-600">
                            <div className="text-sm text-gray-400">Result</div>
                            <pre className="text-xs text-white whitespace-pre-wrap break-words">
                                {JSON.stringify(nodeOutput.result, null, 2)}
                            </pre>
                            </div>
                        )}


                    </div>
                ) : (
                    <div className="text-gray-500">No output yet</div>
                )}
        </div>
    </div>

  );
}