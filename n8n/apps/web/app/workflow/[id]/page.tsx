"use client"


import Workflow from "../../../components/canvasWorkspace";
import NavBar from "../../../components/navabar";
import SaveButton from "../../../components/saveButton";
import SideBar from "../../../components/sidebar";


export default function DashboardLayout() {
  

  return (
    <div className="h-screen w-screen flex flex-row">
      <div id="left" className="w-[15%] h-full">
        <div className="h-full w-full">
          <SideBar />
        </div>
      </div>
      <div id="right" className="flex flex-col h-screen w-[85%]">
        <div className="h-[10%] w-full">
          <NavBar />
        </div>
        <div className="bg-white h-[90%]">
          <Workflow /> 
          
        </div>
      </div>
    </div>
)}
