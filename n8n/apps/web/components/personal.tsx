import { useRouter } from "next/navigation";
import TitleButton from "./titleButton"
import Workflows from "./workflows"; // NEW
import api from "../lib/api";

interface Personaltypes {
  clicked: string | null;
  setClicked: (title: string) => void;
}

export default function Personal({ clicked, setClicked }: Personaltypes) {
  
  const router = useRouter();
  
  async function HandelClick(){
    try{  
    const workflows = await api.get("/workflows"); 
     

    const res = await api.post("/workflow" , {
      title:`New Workflow ${workflows.data.length + 1}`,
      enabled:true,
      nodes:[    {
      id: "Add-trigger",
      position: { x: 100, y: 200 },
      data: { label: "Add trigger"},
      type: "AddTriggernode",
    }],
      connections:[],
      viewport:{x: 100, y: 200 },
      uiState:{
              activeParentId:"Add-trigger",
              firstNodeAdded:false,
              rightPanelOpen:false,
              saveButtonEnable:false,
            }
    });

    const workflow = res.data

    router.push(`/workflow/${workflow.id}`)
  }catch(e:unknown){
    console.error(e)
    throw new Error("Workflow not created")
  }

  }
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mx-10 ">
        <div>
          <div className="text-white text-2xl font-medium mt-4">Personal</div>
          <div className="font-light text-gray-300">
            Workflows and credentials owned by you
          </div>
        </div>
        <div>
          <button className="px-3 py-1 bg-[#ff616e] mt-4 text-white rounded-md shadow hover:bg-orange-700 cursor-pointer" onClick={HandelClick}>
            Create Workflow
          </button>
        </div>
      </div>

      <div className="flex justify-normal gap-4 m-4 mx-10 mt-10 ">
        
        {["Workflows", "Credentials", "Execution"].map((title) => (
          <TitleButton
            key={title}
            title={title}
            clicked={clicked}
            setClicked={setClicked}
          />
        ))}
      </div>


      <div className="mx-10">
        {clicked === "Workflows" && <Workflows />}
        {clicked === "Credentials" }
        {clicked === "Execution" }
      </div>
    </div>
  );
}
