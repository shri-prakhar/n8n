"use client"

import React,{useState} from "react";
import SideBar from "./sidebar";


import NavBar from "./navabar";
import Overview from "./overview";
import Personal from "./personal";

export default function DashboardLayout() {
     const [active, setActive] = useState<string | null>("null");
     const [clicked, setClicked] = useState<string | null>("Workflows");

     console.log(active)
  return (
    <div className="h-screen bg-[#2d2e2e] ">
      <div>
        <SideBar active={active} setActive={setActive} />
      </div>
      <div>
        <NavBar />
    </div>
    <div className="ml-72 mt-12">
      {active === "Personal" ? <Personal clicked={clicked} setClicked={setClicked} />: <Overview clicked={clicked} setClicked={setClicked} setActive={setActive} /> }
    </div>
    
    </div>
    

  );
}
