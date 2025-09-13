import PlusIcon from "../../icons/plus";

export default function AddTrigger({ id, data }: any) {
  return (
    <div className="text-center">
      <div
        className="p-8 bg-[#2d2e2e] rounded-md border border-dashed border-white cursor-pointer"
        onClick={() => data.onAdd && data.onAdd(id)}
      >
        <PlusIcon />
      </div>

      <div className="text-white cursor-pointer mt-2">Add First step..</div>
    </div>
  );
}
