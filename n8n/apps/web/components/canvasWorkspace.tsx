// components/canvasWorkspace.tsx
import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AddTrigger from "./nodes/addTrigger";
import {
  AIAgentNode,
  TelegramNode,
  EmailNode,
  ManualTriggerNode,
  WebhookNode,
} from "./nodes/customnodes";
import RightPanel from "./triggerPanel";

export const nodeTypes = {
  AddTriggernode: AddTrigger,
  Webhooknode: WebhookNode,
  Emailnode: EmailNode,
  Telegramnode: TelegramNode,
  AIAgentnode: AIAgentNode,
  ManualTriggernode: ManualTriggerNode,
};

export default function Workflow() {
  const initial: Node[] = [ {
      id: "Add-trigger",
      position: { x: 100, y: 200 },
      data: { label: "Add trigger", onAdd: (id: string) => handleOpenPanel(id) },
      type: "AddTriggernode",
    },]
  const [nodes, setNodes] = useState<Node[]>(initial);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [activeParentId, setActiveParentId] = useState<string | null>(
    "Add-trigger"
  );

  const [firstNodeAdded, setFirstNodeAdded] = useState(false);

  // minimap visibility
  const [minimap, showminimap] = useState(false);
  let timeout: NodeJS.Timeout | undefined;

  useEffect(() => {
    function handleEvent() {
      showminimap(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        showminimap(false);
      }, 2000);
    }
    window.addEventListener("mousemove", handleEvent);
    window.addEventListener("mousedown", handleEvent);
    window.addEventListener("wheel", handleEvent);
    return () => {
      window.removeEventListener("mousemove", handleEvent);
      window.removeEventListener("mousedown", handleEvent);
      window.removeEventListener("wheel", handleEvent);
    };
  }, []);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges(
      (eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
    );
  }, []);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  // Open panel for a parent id
  const handleOpenPanel = useCallback((parentId: string) => {
    setActiveParentId(parentId);
    setRightPanelOpen(true);
  }, []);

  // Add a new node of type
  const handleAddNode = useCallback(
    (type: keyof typeof nodeTypes) => {
      const timestamp = Date.now();
      const newId = `${type}-${timestamp}`;

      // === CASE 1: First Trigger ===
      if (!firstNodeAdded && activeParentId === "Add-trigger") {
        const triggerNode: Node = {
          id: newId,
          type,
          position: { x: 100, y: 200 },
          data: { onAdd: handleOpenPanel, onDelete: handleDeleteNode },
        };

        // Replace AddTrigger with selected Trigger
        setNodes([triggerNode]);
        setFirstNodeAdded(true);
        setActiveParentId(newId);
        setRightPanelOpen(false);
        return;
      }

      // === CASE 2: Adding Actions ===
      const parentNode = nodes.find((n) => n.id === activeParentId);
      if (!parentNode) return;

      const parentPos = parentNode.position ?? { x: 100, y: 200 };
      const newNodePos = { x: parentPos.x + 250, y: parentPos.y };

      const newNode: Node = {
        id: newId,
        type,
        position: newNodePos,
        data: { onAdd: handleOpenPanel, onDelete: handleDeleteNode },
      };

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [
        ...eds,
        {
          id: `e-${activeParentId}-${newId}`,
          source: activeParentId as string,
          target: newId,
        },
      ]);

      setActiveParentId(newId);
      setRightPanelOpen(false);
    },
    [activeParentId, nodes, firstNodeAdded, handleOpenPanel, handleDeleteNode]
  );

  // helper to check outgoing connections
  const hasOutgoingConnection = useCallback(
    (nodeId: string) => edges.some((e) => e.source === nodeId),
    [edges]
  );

  // attach edge info into node data so customnodes can decide UI
  const enhancedNodes = nodes.map((n) => ({
    ...n,
    data: {
      ...n.data,
      hasOutgoing: hasOutgoingConnection(n.id),
    },
  }));

  if (nodes.length === 0){
    setNodes(initial)
    setEdges([])
    setRightPanelOpen(false)
    setActiveParentId("Add-trigger")
    setFirstNodeAdded(false)
  }

  return (
    <div className="ml-64 mt-12">
      <div className="w-full h-screen mr-72">
        <ReactFlow
          nodes={enhancedNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          panOnScroll
          selectionOnDrag
          nodeTypes={nodeTypes}
          fitView
        >
          <Background
            variant={BackgroundVariant.Dots}
            color="gray"
            bgColor="#2d2e2e"
          />
          <Controls
            showFitView={true}
            showZoom={true}
            showInteractive={true}
            position="bottom-left"
            style={{
              background: "#2a2a2a",
              borderRadius: "0.5rem",
              padding: "6px",
              display: "flex",
              gap: "8px",
              width: "12px",
            }}
          />
          <style jsx global>{`
            .react-flow__controls button {
              background: #2a2a2a !important;
              border-radius: 0.5rem !important;
              padding: 8px !important;
              border: 2px solid #444 !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              transition: background 0.2s ease;
              width: 30px;
              height: 35px;
            }

            .react-flow__controls button:hover {
              background: gray !important;
            }

            .react-flow__controls button svg {
              stroke: white !important;
            }
          `}</style>

          {minimap && (
            <MiniMap
              bgColor="#2d2e2e"
              maskStrokeWidth={20}
              nodeStrokeWidth={20}
              nodeStrokeColor="gray"
              position="bottom-right"
              pannable
              zoomable
              nodeColor={() => "#888"}
              maskColor="gray"
              style={{
                width: 200,
                height: 120,
                background: "#1e1e1e",
                borderRadius: "0.5rem",
              }}
            />
          )}
        </ReactFlow>

        <RightPanel
          open={rightPanelOpen}
          setOpen={setRightPanelOpen}
          onClose={() => setRightPanelOpen(false)}
          onAddNode={handleAddNode}
          firstNodeAdded={firstNodeAdded}
        />
      </div>
    </div>
  );
}
