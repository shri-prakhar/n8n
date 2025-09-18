
import { useCredentialsformStore, useNodeformStore } from "../globalstateVaribles/Reactflow.ts/ReactflowVariables";


export default function CredForm(){
    const { setcredentialsformdata , credentialsformSchema, setcredentialsformSchema ,setcredentialsformopen,credentialsformdata ,credentialsOptions} = useCredentialsformStore()
    const {activeNodeId} = useNodeformStore()
    

    const handleChange = (name: string, value: any) => {
        setcredentialsformdata({ ...credentialsformdata, [name]: value });
    }


    return (
        <>
            <div>
                <form className="flex flex-col gap-4 px-4">
                    {credentialsformSchema.map((field, idx) => (
                        <div key={idx} className="flex flex-col">
                            <label className="text-md font-bold  text-gray-300 mb-1">{field.label}</label>
                                {field.type === "select" ? (
                                <select
                                    className="p-0.5 rounded bg-[#2a2a2a] text-gray-400 text-lg"
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                >
                                    <option value="" disabled selected>
                                    {field.placeholder}
                                    </option>

                                    {field.name !== "credentials" &&
                                    field.options?.map((opt, i) => (
                                        <option key={i} value={opt}>
                                        {opt}
                                        </option>
                                    ))}
                                </select>

                            ) : field.type === "textarea" ? (
                                <textarea
                                    className="p-5 rounded bg-[#2a2a2a] text-white text-lg"
                                    onChange={(e) => handleChange(field.name, e.target.value)}
                                    placeholder={field.placeholder}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    className="px-3 p-1 rounded bg-[#2a2a2a] text-white text-lg"
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
                        onClick={() => setcredentialsformopen(false)}
                    >
                        Cancel
                    </button>
                    
                </div>
            </div>
            </>

  );
}
    