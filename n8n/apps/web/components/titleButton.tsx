import React from "react";


interface titleButtontypes {
    title : string;
    clicked: string | null;
    setClicked: (title: string) => void;
}

export default function TitleButton({title , clicked , setClicked }: titleButtontypes) {  
 

    return (
        <div className={clicked === title? "text-orange-700 border-b cursor-pointer": "text-white cursor-pointer"} onClick={() => {
            setClicked(title)
        }}>
            {title}
        </div>
    );
}
