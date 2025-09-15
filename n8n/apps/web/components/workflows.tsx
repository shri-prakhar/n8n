"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";

interface Workflow {
  id: string;
  title: string;
  enabled: boolean;
  nodes: [];
  connections: [];
  userId: string;
}

export default function Workflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchWorkflows() {
      try {
        const res = await api.get("/workflows", { withCredentials: true });
        setWorkflows(res.data);
      } catch (err: any) {
        console.error("Error fetching workflows:", err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkflows();
    
  }, []);

  const handleClick = (id: string) => {
    router.push(`/workflow/${id}`);
  };

  return (
    <div className="">
      {loading ? (
        <p className="text-white">Loading workflows...</p>
      ) : workflows.length === 0 ? (
        <p className="text-gray-400">No workflows found.</p>
      ) : (
        workflows.map((workflow) => (
          <div key={workflow.id} onClick={() => handleClick(workflow.id)} className="cursor-pointer mt-6 space-y-4 w-full border border-gray-600 rounded-md p-4 bg-[#2d2e2e] hover:bg-gray-500 transition duration-200">
            <h3 className="text-lg font-semibold text-white">
              {workflow.title}
            </h3>
          </div>
        ))
      )}
    </div>
  );
}
