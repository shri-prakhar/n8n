
"use client";
import { Bot, Code2, Mail, WebhookIcon } from "lucide-react";
import { credSchemas } from "../globalstateVaribles/credformschema";
import { useCredentialsformStore, useNodeformStore } from "../globalstateVaribles/Reactflow.ts/ReactflowVariables";
import { FaTelegramPlane } from "react-icons/fa";


export default function NodeConfigForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const { formOpen, setformopen, formSchema, formdata, setformdata ,activeNodeId } = useNodeformStore();
  const {setcredentialsformopen, setcredentialsformSchema,credentialsOptions }=useCredentialsformStore()

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
  };

  return (
    <div className=" fixed bg-[#4d3e3d]/70 z-10 inset-0">
    <div className="fixed top-12 left-5 w-370 h-155 bg-[#2d2e2e] flex justify-center items-center z-20">
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
            <div className="position fixed top-18 left-143 text-sm px-4 pb-2 text-orange-500 font-bold font-sans text-orange border-b-2  border-orange-500"> 
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
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    className="px-3 p-0.5 rounded bg-[#2a2a2a] text-white"
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
    </div>

  );
}