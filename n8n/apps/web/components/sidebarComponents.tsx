"use client"

import { ReactElement } from "react";

interface Sidebarcomptypes {
    title: string;
    icon?: ReactElement;
    active?: string | null;
    setActive?: (title: string) => void;
}

const buttonclass = {
    primary: "text-gray-300 text-md flex justify-right items-center gap-4 border border-[#414244] m-2 p-2 cursor-pointer hover:text-white hover:bg-gray-500",
    secondary: "text-gray-300 text-md bg-gray-500 flex justify-right items-center gap-4 border border-[#525456] m-2 p-2 cursor-pointer"
};

export default function SideBarComp({ title, icon, active, setActive }: Sidebarcomptypes) {

    
    const handleClick = () => {
        setActive?.(title); 
    };

    return (
        <div
            className={`${active === title ? buttonclass.secondary : buttonclass.primary}`}
            onClick={handleClick}
        >
            {icon}
            {title}
        </div>
    );
}
