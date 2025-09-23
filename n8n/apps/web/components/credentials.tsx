"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import { useCredentialsformStore } from "./globalstateVaribles/Reactflow.ts/ReactflowVariables";

interface Credentials {
  id: string;
  title: string;
  paltform: boolean;
  data: [];
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

export default function Credentials() {
  const [credentials, setCredentials] = useState<Credentials[]>([]);
  const [loading, setLoading] = useState(true);
  const {setcredentialsformopen} = useCredentialsformStore()
  

  useEffect(() => {
    async function fetchCredentials() {
      try {
        const res = await api.get("/cred/allCredentials", { withCredentials: true });
        setCredentials(res.data.creds);
      } catch (err: any) {
        console.error("Error fetching credentials:", err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCredentials();
    
  }, []);

  const handleClick = () => {
    console.log("hi")
    setcredentialsformopen(true)
  };

  return (
    <div className="">
      {loading ? (
        <p className="text-white">Loading credentials...</p>
      ) : credentials.length === 0 ? (
        <p className="text-gray-400">No credentials found.</p>
      ) : (
        credentials.map((credentials) => (
        <div
          key={credentials.id}
          onClick={() => handleClick}
          className="
            cursor-pointer mt-6 w-full rounded-md border border-gray-600
            bg-[#414244] p-3 
            hover:bg-gray-500 hover:shadow-lg hover:scale-[1.02]
            transition-all duration-300 ease-in-out
          "
        >
          <h3 className="text-base font-medium text-white">
            {credentials.title}
          </h3>
          <p className="text-xs text-gray-300 mt-1">
            Created: {formatDate(credentials.createdAt)} | Last updated: {formatDate(credentials.updatedAt)}
          </p>
        </div>
        ))
      )}
    </div>
  );
}
