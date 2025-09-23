import { Bot, Code2, Mail, WebhookIcon } from "lucide-react";
import {  useNodeformStore } from "../globalstateVaribles/Reactflow.ts/ReactflowVariables";
import CredForm from "./credformconfig";
import SaveCredButton from "./saveCredButton";
import { FaTelegramPlane } from "react-icons/fa";

export default function Credentialform(){
    const {activeNodeId} = useNodeformStore()
    const renderIcon = () => {
  const type = activeNodeId?.toString().split("node")[0];

  if (type === "Email") return <span><Mail /></span>;
  if (type === "Telegram") return <span><FaTelegramPlane /></span>;
  if (type === "AIAgent") return <span><Bot /></span>;
  if (type === "Webhook") return <span><WebhookIcon /></span>;
  if (type === "Tools") return <span><Code2 /></span>;

  return null; 
};
    

    return(
        <div className=" fixed bg-[#4d3e3d]/70 z-10 inset-0">
            <div className=" fixed left-60 top-12 w-[1100px] h-[570px] bg-[#2e2e2e]  rounded-lg z-20 flex flex-col hidden-overflow">
                <div className="border-b border-gray-500 h-[15%] w-full flex justify-between p-8 px-10">
                    <div className="text-white text-xl font-sans font-bold flex items-center gap-3">
                        <div>
                            {renderIcon()}
                        </div>
                        
                        <div>
                        <div>
                            {activeNodeId?.toString().split("node")[0]} Credentials
                        </div>
                        <div className="text-gray-500 text-sm font-sans font-normal">
                            {activeNodeId?.toString().split("node")[0]} API
                        </div>
                    </div>
                    </div>
                    <div className="">
                        <SaveCredButton />
                    </div>
                </div>
                <div className="h-[85%] w-full flex flex-row">
                    <div className="w-[20%] text-gray-400 font-medium text-md p-3 ">
                        <div className="p-1.5 mb-2  hover:bg-gray-500 cursor-pointer  rounded-md "> 
                            Connection
                        </div >
                        <div className="p-1.5 mb-2 hover:bg-gray-500 cursor-pointer  rounded-md ">
                            Sharing
                        </div>
                        <div className="p-1.5 mb-2 hover:bg-gray-500 cursor-pointer  rounded-md ">
                            Details
                        </div>
                    </div>
                    <div className="w-[80%] mt-6">
                        <CredForm />
                    </div>
                </div>
                
            </div>
        </div>
        
    );
}
