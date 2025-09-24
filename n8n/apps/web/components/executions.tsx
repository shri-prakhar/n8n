// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import api from "../lib/api";

// interface Executions {
  
// id:string;
// executionid:string;
// nodeId:string;
// type:string;
// status:string;
// logs:[];
// result:[];
// startedAt:string;
// }

// const formatDate = (dateStr: string) =>
//   new Date(dateStr).toLocaleString("en-US", {
//     year: "numeric",
//     month: "short",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });

// export default function Executions() {
//   const [Executions, setExecutions] = useState<Executions[]>([]);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     async function fetchExecutions() {
//       try {
//         const res = await api.get("/workflows", { withCredentials: true });
//         setExecutions(res.data);
//       } catch (err: any) {
//         console.error("Error fetching workflows:", err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchExecutions();
    
//   }, []);


//   return (
//     <div className="">
//       {loading ? (
//         <p className="text-white">Loading workflows...</p>
//       ) : Executions.length === 0 ? (
//         <p className="text-gray-400">No workflows found.</p>
//       ) : (
//         Executions.map((Executions) => (
//         <div
//           key={Executions.id}
//           className="
//             cursor-pointer mt-6 w-full rounded-md border border-gray-600
//             bg-[#414244] p-3 
//             hover:bg-gray-500 hover:shadow-lg hover:scale-[1.02]
//             transition-all duration-300 ease-in-out
//           "
//         >
//           <h3 className="text-base font-medium text-white">
//             {Executions.nodeId} 
//           </h3>
//           <p className="text-xs text-gray-300 mt-1 ">
//             nodetype: {Executions.type}
//             Logs: {Executions.logs}
//             Results: {Executions.result}
//             Created: {formatDate(Executions.startedAt)} 
//           </p>
//         </div>
//         ))
//       )}
//     </div>
//   );
// }
