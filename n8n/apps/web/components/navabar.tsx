"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { UserCircle } from "lucide-react";
import api from "../lib/api";
import SaveButton from "./saveButton";

interface Workflow {
  id: string;
  title: string;
}

export default function NavBar() {
  const params = useParams<{ id: string }>(); 
  const id = params?.id;
  
  const [workflowTitle, setWorkflowTitle] = useState<string>("");

  useEffect(() => {
    async function fetchWorkflowTitle() {
      if (!id) return;
      try {
        const res = await api.get(`/${id}`, { withCredentials: true });
        const wf: Workflow = res.data;
        setWorkflowTitle(wf.title);
      } catch (error) {
        console.error("Failed to fetch workflow title", error);
      }
    }
    fetchWorkflowTitle();
  }, [id]);

  return (
    <div className=" h-full w-full bg-[#414244] border-b border-gray-500 flex items-center text-lg text-gray-400 gap-2 p-2">
      <div className="w-full flex flex-row justify-between px-4">
        <div className="flex flex-row gap-2 ">
          <div className="pt-1">
            <UserCircle />
          </div>
          <div>
            {id && workflowTitle ? ( <div className="flex items-center ">
              Personal / {workflowTitle} 
              <div className="positon fixed">
              </div>
              </div>): "Personal"}
          </div>
        </div>
        <div>
          <SaveButton />
        </div>
      </div>
    </div>
  );
}
