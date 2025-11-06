
import { Handle, Position } from "@xyflow/react";
import {
  Mail,
  Bot,
  MousePointerClick,
  Webhook,
  Trash2Icon,
  PlayIcon,
  CircleStopIcon,
  Code2,
} from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { useState } from "react";
import { useNodeformStore } from "../globalstateVaribles/Reactflow.ts/ReactflowVariables";
import { nodeSchemas } from "../globalstateVaribles/nodeformschemas";
import { useNodeOutputstore } from "../globalstateVaribles/Reactflow.ts/ReactflowVariables";
import SpinnerOverlay from "./spinOverlay";

const baseNode =
  "relative border-2 rounded-lg shadow-md text-white font-medium p-4 bg-[#414244] flex flex-col items-center justify-center min-w-[120px] min-h-[80px] ";

function NodeActions({ onDelete }: { onDelete?: () => void }) {
  const handleClick = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };
  



  return (
    <div className="absolute top-1 right-1 flex ">
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
    <Handle
      type="source"
      position={Position.Right}
      id={handleId}
      className={hiddenClasses}
      onMouseDown={(e) => {
        e.stopPropagation();
        if (!hidden) {
          onAdd?.(id);
        }
      }}
      style={{
        width: 0,
        height: 0,
        background: "transparent", 
      }}
    >
      <svg
        width="70"
        height="24"
        viewBox="0 0 75 24"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "translateX(0%) translateY(-50%)" }}
      >
        
        <circle cx="6" cy="12" r="6" fill="#cfd8e0" />

        <line x1="6" y1="12" x2="40" y2="12" stroke="#bfc8cf" strokeWidth="2" strokeLinecap="round" />
        
        <rect x="40" y="2" width="20" height="20" rx="6" ry="6" fill="#2b2f33" stroke="#9fa9b0" strokeWidth="2" />
        <g transform="translate(50,12)" stroke="#9fa9b0" strokeWidth="2" strokeLinecap="round">
          <line x1="-5" y1="0" x2="5" y2="0" />
          <line x1="0" y1="-5" x2="0" y2="5" />
        </g>
      </svg>
    </Handle>
  );
}


function withHoverActions(NodeBody: any) {
  
  return function WrappedNode({ id, data }: any) {
    const borderColor = useNodeBorderColor(id);
    
  const { nodeOutputs } = useNodeOutputstore();
  const nodeOutput = nodeOutputs[id] || {};
    const [hover, setHover] = useState(false);
    const {
      setformopen,
      setactiveNodeId,
      setformSchema,
      setformdata,
    } = useNodeformStore();

    const shortId = id.split("-")[0]; 


    return (
      <div
        className={`${baseNode} cursor-pointer ${borderColor}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setformopen(true);
          setactiveNodeId(id); 
          
          const schema = nodeSchemas[shortId] || [
            { name: "title", label: "Title", type: "text" },
            { name: "description", label: "Description", type: "textarea" },
          ];

          setformSchema(schema);
          setformdata(data?.customData || {});
        }}
      >
        {hover && <NodeActions onDelete={() => data?.onDelete?.(id)} />}
        { nodeOutput.status === "RUNNING" && <SpinnerOverlay />}
        <NodeBody id={id} data={data} />
      </div>
    );
  };
}

function useNodeBorderColor(id: string) {
  const { nodeOutputs } = useNodeOutputstore();
  const nodeOutput = nodeOutputs[id] || {};

  if (!nodeOutput.status ) return "border-red-500"; 
  if (nodeOutput.status === "SUCCESS") return "border-green-500";
  return "border-red-500"; 
}

function WebhookBody({ id, data }: any) {

  return (
    <div >
      <Webhook className="w-6 h-6 text-white mb-2" />
      <span className="text-sm">Webhook</span>

      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-white"
        style={{ width: "6px", height: "16px", borderRadius: "0" }}
      />
      <PlusHandle id={id} onAdd={data.onAdd} hidden={data.hasOutgoing} />
    </div>
  );
}
export const WebhookNode = withHoverActions(WebhookBody);

function EmailBody({ id, data }: any) {

  return (
    <div >
      <Mail className="w-6 h-6 text-green-400 mb-2" />
      <span className="text-sm">Send Email</span>

      <Handle
        type="target"
        position={Position.Left}
        style={{ width: "6px", height: "16px", borderRadius: "0", backgroundColor: "white" }}
      />
      <PlusHandle id={id} onAdd={data.onAdd} hidden={data.hasOutgoing} />
    </div>
  );
}
export const EmailNode = withHoverActions(EmailBody);

function TelegramBody({ id, data }: any) {
  const borderColor = useNodeBorderColor(id);

  return (
    <div className={`${borderColor}`}>
      <FaTelegramPlane className="w-6 h-6 text-blue-400 mb-2" />
      <span className="text-sm">Get a Chat</span>

      <Handle
        type="target"
        position={Position.Left}
        style={{ width: "6px", height: "16px", borderRadius: "0", backgroundColor: "white" }}
      />
      <PlusHandle id={id} onAdd={data.onAdd} hidden={data.hasOutgoing} />
    </div>
  );
}
export const TelegramNode = withHoverActions(TelegramBody);
function AIAgentBody({ id, data }: any) {
  const tools = data?.tools || [];
  
  return (
    <div >
      <Bot className="w-6 h-6 text-white mb-2" />
      <span className="text-sm">AI Agent </span>


      <Handle type="target" position={Position.Left} className="w-3 h-3 bg-white"         
      style={{
          width: '6px',
          height: '16px',
          borderRadius: '0',
          backgroundColor:'white'
        }} />


      <PlusHandle id={id} onAdd={data.onAdd} hidden={data.hasOutgoing} />
<Handle
  type="source"
  id={`${id}-tools`}
  position={Position.Bottom}
  style={{
    width: 0,
    height: 0,
    background: "transparent", 
  }}
  onMouseDown={(e) => {
    e.stopPropagation();
    e.preventDefault();
    data?.onToolAdd?.(id);
  }}
>
  <svg
    width="60"
    height="100"
    viewBox="0 0 60 100"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      transform: "translate(-47%, -10%)", // center on bottom edge
    }}
  >

    <g transform="translate(30,12) rotate(45)">
      <rect x="-8" y="-8" width="16" height="16" rx="2" ry="2" fill="#cfd8e0" />
    </g>


    <text x="30" y="32" fill="#9fb0c0" fontFamily="Arial, Helvetica, sans-serif" fontSize="10" textAnchor="middle">
      Tool
    </text>

    
    <line x1="30" y1="38" x2="30" y2="70" stroke="#bfc8cf" strokeWidth="2.5" strokeLinecap="round" />

    
    <rect x="18" y="70" width="24" height="20" rx="4" ry="4" fill="#2b2f33" stroke="#9fa9b0" strokeWidth="2" />
    <g transform="translate(30,80)" stroke="#9fa9b0" strokeWidth="2" strokeLinecap="round">
      <line x1="-5" y1="0" x2="5" y2="0" />
      <line x1="0" y1="-5" x2="0" y2="5" />
    </g>
  </svg>
</Handle>

    

    </div>
  );
}
export const AIAgentNode = withHoverActions(AIAgentBody);


function ManualTriggerBody({ id, data }: any) {

  return (
    <div >
      <MousePointerClick className="w-6 h-6 mb-2" />
      <span className="text-sm">Manual Trigger</span>
      <PlusHandle id={id} onAdd={data.onAdd} hidden={data.hasOutgoing} />
    </div>
  );
}

export const ManualTriggerNode = withHoverActions(ManualTriggerBody);
function ToolBody({ id, data }: any) {
  

  return (
    <div >
      <Code2 className="w-5 h-5 text-purple-400" />
      <span className="ml-1">Tool</span>
      <Handle
        type="target"
        id="tool-target"
        position={Position.Top}
        style={{ width: "6px", height: "16px", borderRadius: "0", backgroundColor: "white" }}
      />
    </div>
  );
}

export const ToolNode = withHoverActions(ToolBody);
