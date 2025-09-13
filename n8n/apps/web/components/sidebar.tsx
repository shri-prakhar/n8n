"use client"

import React from "react";
import SideBarComp from "./sidebarComponents";
import N8N from "../icons/n8n";
import Home from "../icons/home";
import Personal from "../icons/personal";

interface Sidebartypes {

    active?: string | null;
    setActive?: (title: string) => void;
}

export default function SideBar({active , setActive }: Sidebartypes) {  
 

    return (
        <div className="fixed top-0 left-0 w-64 bg-[#525456] h-screen">
            <div className="mt-12 mx-4 flex items-center gap-1 text-white text-sm font-bold">
                <N8N />
                n8n
            </div>
            <div>
                <SideBarComp title="Overview" icon={<Home />} active={active} setActive={setActive} />
                <SideBarComp title="Personal" icon={<Personal />} active={active} setActive={setActive} />
            </div>
        </div>
    );
}
