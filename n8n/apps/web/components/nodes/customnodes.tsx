// components/nodes/customnodes.tsx
import { Handle, Position } from "@xyflow/react";
import {
  Mail,
  Bot,
  MousePointerClick,
  Webhook,
  Trash2Icon,
  PlayIcon,
  CircleStopIcon,
  Hammer,
} from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { useState } from "react";

const baseNode =
  "relative rounded-l-full border-l-6 shadow-md text-white font-medium p-4 bg-[#2d2e2e] flex flex-col items-center justify-center min-w-[120px] min-h-[80px]";

function NodeActions({ onDelete }: { onDelete?: () => void }) {
  const handleClick = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };

  return (
    <div className="absolute top-1 right-1 flex gap-1">
      <IconButton title="Delete" onClick={(e) => handleClick(e, onDelete)}>
        <Trash2Icon className="w-4 h-4 text-white" />
      </IconButton>
      <IconButton title="Execute" onClick={(e) => handleClick(e)}>
        <PlayIcon className="w-4 h-4 text-white" />
      </IconButton>
      <IconButton title="Quit" onClick={(e) => handleClick(e)}>
        <CircleStopIcon className="w-4 h-4 text-white" />
      </IconButton>
    </div>
  );
}

function IconButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: (e: React.MouseEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="w-6 h-6 rounded bg-transparent text-xs flex items-center justify-center cursor-pointer"
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

function PlusHandle({
  id,
  onAdd,
  hidden,
}: {
  id: string;
  onAdd?: (id: string) => void;
  hidden?: boolean;
}) {
  const handleId = `${id}-out`;
  const hiddenClasses = hidden ? "opacity-0 pointer-events-none" : "";

  return (
    <>
      <Handle
        type="source"
        position={Position.Right}
        id={handleId}
        className={`!w-6 !h-6 flex items-center justify-center bg-transparent border cursor-pointer ${hiddenClasses}`}
        style={{ right: "-16px" }}
        onMouseDown={(e) => {
          e.stopPropagation();
          if (!hidden) {
            onAdd?.(id);
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="gray"
          strokeWidth={2}
          viewBox="0 0 24 24"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </Handle>

      <div
        className={`absolute top-1/2 right-0 h-[2px] w-4 bg-gray-400 translate-y-[-50%] ${hidden ? "opacity-0" : ""}`}
      />
    </>
  );
}

function withHoverActions(NodeBody: any) {
  return function WrappedNode({ id, data }: any) {
    const [hover, setHover] = useState(false);

    return (
      <div
        className={baseNode}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && <NodeActions onDelete={() => data?.onDelete?.(id)} />}
        <NodeBody id={id} data={data} />
      </div>
    );
  };
}

function WebhookBody({ id, data }: any) {
  return (
    <>
      <Webhook className="w-6 h-6 text-white mb-2" />
      <span className="text-sm">Webhook</span>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      <PlusHandle id={id} onAdd={data.onAdd} hidden={data.hasOutgoing} />
    </>
  );
}
export const WebhookNode = withHoverActions(WebhookBody);

function EmailBody({ id, data }: any) {
  return (
    <>
      <Mail className="w-6 h-6 text-green-400 mb-2" />
      <span className="text-sm">Send Email</span>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      <PlusHandle id={id} onAdd={data.onAdd} hidden={data.hasOutgoing} />
    </>
  );
}
export const EmailNode = withHoverActions(EmailBody);

function TelegramBody({ id, data }: any) {
  return (
    <>
      <FaTelegramPlane className="w-6 h-6 text-blue-400 mb-2" />
      <span className="text-sm">Get a Chat</span>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      <PlusHandle id={id} onAdd={data.onAdd} hidden={data.hasOutgoing} />
    </>
  );
}
export const TelegramNode = withHoverActions(TelegramBody);
function AIAgentBody({ id, data }: any) {
  return (
    <div className="w-[220px] min-h-[120px] flex flex-col items-center relative">
      <Bot className="w-6 h-6 text-white mb-2" />
      <span className="text-sm">AI Agent</span>


      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />


      <PlusHandle id={id} onAdd={data.onAdd} hidden={data.hasOutgoing} />

    <Handle
      type="source"
      id={`${id}-tools`}
      position={Position.Bottom}
      className="!w-6 !h-6 bg-purple-500 cursor-pointer rounded-full flex items-center justify-center"
      style={{ bottom: "-40px" }}
      onMouseDown={(e) => {
        e.stopPropagation();
        e.preventDefault();
        data?.onToolAdd?.(id); 
      }}
    >
      🛠
    </Handle>


      <div className="absolute bottom-[-30px] left-1/2 w-[2px] h-5 bg-purple-400 -translate-x-1/2" />
    </div>
  );
}
export const AIAgentNode = withHoverActions(AIAgentBody);


function ManualTriggerBody({ id, data }: any) {
  return (
    <>
      <MousePointerClick className="w-6 h-6 mb-2" />
      <span className="text-sm">Manual Trigger</span>
      <PlusHandle id={id} onAdd={data.onAdd} hidden={data.hasOutgoing} />
    </>
  );
}
export const ManualTriggerNode = withHoverActions(ManualTriggerBody);

function ToolBody({ id, data }: any) {
  return (
    <>
      <Hammer className="w-5 h-5 text-purple-400" />
      <span className="ml-2">Tool</span>
      <Handle type="target" id="tool-target" position={Position.Top} className="w-3 h-3 bg-purple-500" />
    </>
  );
}
export const ToolNode = withHoverActions(ToolBody);
