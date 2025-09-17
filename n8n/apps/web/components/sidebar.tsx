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
        <div className="w-full bg-[#414244] h-full flex flex-col gap-2">
            <div className=" flex flex-row items-center gap-1 text-white text-sm font-bold h-[10%] p-4 pt-8">
                <div>
                    <N8N />
                </div>
                <div>
                    n8n
                </div>
            </div>
            <div className="h-[90%]">
                <SideBarComp title="Overview" icon={<Home />} active={active} setActive={setActive} />
                <SideBarComp title="Personal" icon={<Personal />} active={active} setActive={setActive} />
            </div>
        </div>
    );
}
