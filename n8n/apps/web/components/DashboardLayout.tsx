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
    <div className="h-screen w-screen bg-[#2d2e2e] flex">
      <div id="leftBar" className="h-screen w-[15%]">
        <SideBar active={active} setActive={setActive} />
      </div>
      <div id="rightBar" className="h-screen w-[85%] flex flex-col">
        <div className="h-[10%]">
          <NavBar />
        </div>
        <div className="">
          {active === "Personal" ? <Personal clicked={clicked} setClicked={setClicked} />: <Overview clicked={clicked} setClicked={setClicked} setActive={setActive} /> }
        </div>
      </div>    
    </div>
    

  );
}
