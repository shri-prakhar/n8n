import TitleButton from "./titleButton"

interface Personaltypes {
    clicked: string | null;
    setClicked: (title: string) => void;
}



export default function Personal({clicked , setClicked}: Personaltypes){
    return (
        <div>
            <div className="flex items-center justify-between mx-10 ">
      <div>
        <div className="text-white text-2xl font-medium mt-4">Personal</div>
        <div className="font-light text-gray-300">
          Workflows and credentials owned by you
        </div>
      </div>
      <div>
        <button className="px-3 py-1 bg-[#ff616e] mt-4 text-white rounded-md shadow hover:bg-orange-700">
          Create Workflow
        </button>
      </div>
    </div>
    <div className="flex justify-normal gap-4 m-4 mx-10 mt-10 ">
        <TitleButton title="Workflows" clicked={clicked} setClicked={setClicked} />
        <TitleButton title="Credentials" clicked={clicked} setClicked={setClicked} />
        <TitleButton title="Execution" clicked={clicked} setClicked={setClicked} />
    </div>
        </div>
    )
}  