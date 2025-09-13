"use client";

import {  useRouter } from "next/navigation";
import TitleButton from "./titleButton"
import api from "../lib/api";

interface OverViewtypes {
    clicked: string | null;
    setClicked: (title: string) => void;
    setActive?: (title: string) => void;
}




export default function Overview({clicked , setClicked }: OverViewtypes) {

  const router = useRouter();
  let x=0
  async function HandelClick(){
    try{
    
      x++;

    const res = await api.post("/workflow" , {
      title:`New Workflow ${x}`,
      enabled:true,
      nodes:[],
      connections:[],
    });

    const workflow = res.data

    router.push(`/workflow/${workflow.id}`)
  }catch(e:unknown){
    console.error(e)
    throw new Error("Workflow not created")
  }

  }
  return (
    <>
    <div className="flex items-center justify-between mx-10 ">
      <div>
        <div className="text-white text-2xl font-medium mt-4">Overview</div>
        <div className="font-light text-gray-300">
          All the workflows, credentials and executions you have access to
        </div>
      </div>
      <div>
        <button className="px-3 py-1 bg-[#ff616e] mt-4 text-white rounded-md shadow cursor-pointer hover:bg-orange-700 " onClick={HandelClick}>
          Create Workflow
        </button>
      </div>
    </div>
        <div className="flex justify-normal gap-4 m-4 mx-10 mt-10 ">
            <TitleButton title="Workflows" clicked={clicked} setClicked={setClicked} />
            <TitleButton title="Credentials" clicked={clicked} setClicked={setClicked} />
            <TitleButton title="Execution" clicked={clicked} setClicked={setClicked} />
        </div>
        </>

  );
}
