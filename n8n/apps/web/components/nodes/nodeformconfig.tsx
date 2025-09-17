
"use client";
import { useNodeformStore } from "../globalstateVaribles/Reactflow.ts/ReactflowVariables";

export default function NodeConfigForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const { formOpen, setformopen, formSchema, formdata, setformdata ,activeNodeId } = useNodeformStore();

  if (!formOpen) return null;

  const handleChange = (name: string, value: any) => {
    setformdata({ ...formdata, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(formdata);
    setformopen(false);
  };

  return (
    
    <div className="position fixed top-12 left-5 w-370 h-155 inset-0 bg-[#2d2e2e] bg-opacity-50 flex justify-center items-center z-[1]">
        <div className="position fixed w-350 h-170 bg-[#414245] rounded-xl shadow-lg w-[380px] overflow-hidden">
            <div className="text-white mb-4 text-lg font-sans font-semibold w-full flex justify-between p-4 pb-10 px-5 bg-[#525456] shadow-md">
                {activeNodeId?.toString().split("node")[0]}
                
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
                                    <option value="" disabled selected className="text-gray-400">
                                        {field.placeholder}
                                    </option>
                                    {field.options?.map((opt, i) => (
                                        <option key={i} value={opt} className="text-orange-500">
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

  );
}
