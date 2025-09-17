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
  createdAt: string;
  updatedAt: string;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

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
        <div
          key={workflow.id}
          onClick={() => handleClick(workflow.id)}
          className="
            cursor-pointer mt-6 w-full rounded-md border border-gray-600
            bg-[#414244] p-3 
            hover:bg-gray-500 hover:shadow-lg hover:scale-[1.02]
            transition-all duration-300 ease-in-out
          "
        >
          <h3 className="text-base font-medium text-white">
            {workflow.title}
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Created: {formatDate(workflow.createdAt)} | Last updated: {formatDate(workflow.updatedAt)}
          </p>
        </div>
        ))
      )}
    </div>
  );
}
