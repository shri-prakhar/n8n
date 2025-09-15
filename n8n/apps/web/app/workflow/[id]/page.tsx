"use client"


import Workflow from "../../../components/canvasWorkspace";
import NavBar from "../../../components/navabar";
import SideBar from "../../../components/sidebar";


export default function DashboardLayout() {

  return (
    <div className="h-screen bg-[#2d2e2e] ">
      <div>
        <SideBar />
      </div>
      <div >
        <NavBar />
        
    </div>
    
        
    <div className="ml-72 mt-12">
          </div>
            <Workflow />
            
            
    </div>
    
    

  );
}
