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
    <div className="w-full bg-[#525456] fixed top-0 h-12 border-b border-gray-500 flex items-center pl-72 text-lg text-gray-400 gap-2">
      <UserCircle />
      {id && workflowTitle ? ( <div className="flex items-center ">
        
        Personal / {workflowTitle} 
        <div className="positon fixed right-20">
        <SaveButton />
        </div>
        </div>): "Personal"}
    </div>
  );
}
