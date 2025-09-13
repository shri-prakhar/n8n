import { Handle, Position } from "@xyflow/react";
import { Mail, Bot, MousePointerClick, Webhook,  Trash2Icon, PlayIcon, CircleStopIcon } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { useState } from "react";

const baseNode =
  "relative rounded-l-full border-l-6 shadow-md text-white font-medium p-4 bg-[#2d2e2e] flex flex-col items-center justify-center min-w-[120px] min-h-[80px]";

function NodeActions({ onDelete }: { onDelete?: () => void }) {
  return (
    <div className="absolute top-1 right-1 flex gap-1">
      <button
        className="w-3 h-3 rounded bg-transparent text-xs flex items-center justify-center cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onDelete && onDelete();
        }}
        title="Delete"
      >
        <Trash2Icon className="w-4 h-4 text-white" />
      </button>
      <button
        className="w-3 h-3 rounded bg-transparent text-xs flex items-center justify-center cursor-pointer"
        title="Execute"
        onClick={(e) => e.stopPropagation()}
      >
        <PlayIcon className="w-4 h-4 text-white" />
      </button>
      <button
        className="w-3 h-3 rounded bg-transparent text-xs flex items-center justify-center cursor-pointer"
        title="Quit"
        onClick={(e) => e.stopPropagation()}
      >
        <CircleStopIcon className="w-4 h-4 text-white" />
      </button>
    </div>
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
  if (hidden) return null;
  return (
    <>
      <Handle
        type="source"
        position={Position.Right}
        id="plus-handle"
        className="!w-6 !h-6 flex items-center justify-center bg-transparent border cursor-pointer"
        style={{ right: "-16px" }}
        onMouseDown={(e) => {
          e.stopPropagation();
          onAdd?.(id);
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
      <div className="absolute top-1/2 right-0 h-[2px] w-4 bg-gray-400 translate-y-[-50%]" />
    </>
  );
}

// 🔹 Higher-order component to wrap nodes with hover state
function withHoverActions(NodeBody: any) {
  return function WrappedNode({ id, data }: any) {
    const [hover, setHover] = useState(false);

    return (
      <div
        className={baseNode}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        {hover && <NodeActions onDelete={() => data.onDelete?.(id)} />}
        <NodeBody id={id} data={data} />
      </div>
    );
  };
}

// ==================== NODE DEFINITIONS ====================

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
    <div className="w-[220px] min-h-[120px] flex flex-col items-center">
      <Bot className="w-6 h-6 text-white mb-2" />
      <span className="text-sm">AI Agent</span>
      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-gray-400" />
      <PlusHandle id={id} onAdd={data.onAdd} hidden={data.hasOutgoing} />
      <Handle type="target" position={Position.Bottom} id="chat" className="w-3 h-3 bg-blue-400" />
      <Handle type="target" position={Position.Bottom} id="memory" className="w-3 h-3 bg-green-400 ml-6" />
      <Handle type="target" position={Position.Bottom} id="tools" className="w-3 h-3 bg-purple-400 ml-12" />
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
