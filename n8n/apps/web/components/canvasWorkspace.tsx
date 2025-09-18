  // components/canvasWorkspace.tsx
  "use client";
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
    ReactFlowInstance,
    MarkerType,
  } from "@xyflow/react";
  import "@xyflow/react/dist/style.css";
  import AddTrigger from "./nodes/addTrigger";
  import {
    AIAgentNode,
    TelegramNode,
    EmailNode,
    ManualTriggerNode,
    WebhookNode,
    ToolNode,
  } from "./nodes/customnodes";
  import RightPanel from "./triggerPanel";
  import { useCredentialsformStore, useNodeformStore, useSaveButtonStore, usetoolpanelStore } from "./globalstateVaribles/Reactflow.ts/ReactflowVariables";
  import api from "../lib/api";
  import { useParams } from "next/navigation";
  import ToolPanel from "./aiAgenttoolpanel";
import { MoveLeft, PanelBottom } from "lucide-react";
import ExecuteWorkflowButton from "./nodes/executeButton";
import NodeConfigForm from "./nodes/nodeformconfig";
import { nodeSchemas } from "./globalstateVaribles/nodeformschemas";
import Credentialform from "./nodes/credentialsform";
  <svg width="0" height="0">
  <defs>
    <marker
      id="rectArrow"
      markerWidth="10"
      markerHeight="6"
      refX="10"  
      refY="3"
      orient="auto"
      markerUnits="strokeWidth"
    >
      <rect x="0" y="0" width="6" height="6" fill="#00bcd4" />
    </marker>
  </defs>
</svg>


  export const nodeTypes = {
    AddTriggernode: AddTrigger,
    Webhooknode: WebhookNode,
    Emailnode: EmailNode,
    Telegramnode: TelegramNode,
    AIAgentnode: AIAgentNode,
    ManualTriggernode: ManualTriggerNode,
    Toolnode: ToolNode, 
  };

  export default function Workflow() {
    const {
      saveButtonEnable,
      setSaveButtonEnable,
      setSaveWorkflow,
    } = useSaveButtonStore();

   const {
      toolPanelOpen,
      setToolPanelOpen,
      activeToolParentId,
      setActiveToolParentId,} = usetoolpanelStore()
      
      const {credentialsformOpen} = useCredentialsformStore()

    const params = useParams<{ id: string }>();
    const id = params?.id;

    const initialPlain: Node[] = [
      {
        id: "Add-trigger",
        position: { x: 100, y: 200 },
        data: { label: "Add trigger" },
        type: "AddTriggernode",
      },
    ];

    const [nodes, setNodes] = useState<Node[]>(initialPlain);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [rightPanelOpen, setRightPanelOpen] = useState(false);
    const [activeParentId, setActiveParentId] = useState<string | null>(
      "Add-trigger"
    );
    const [firstNodeAdded, setFirstNodeAdded] = useState(false);
    const [minimap, showminimap] = useState(false);

    const [reactFlowInstance, setReactFlowInstance] =
      useState<ReactFlowInstance | null>(null);
    const [pendingViewport, setPendingViewport] = useState<any>(null);
    const { setformopen, setformSchema, setactiveNodeId, setformdata } = useNodeformStore();

    let timeout: NodeJS.Timeout | undefined;

    const handleDeleteNode = useCallback(
      (nodeId: string) => {
        setSaveButtonEnable(false);
        setNodes((nds) => nds.filter((n) => n.id !== nodeId));
        setEdges((eds) =>
          eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
        );
        // if deleted node was active tool parent, clear it
        if (activeToolParentId === nodeId) {
          setActiveToolParentId(null);
          setToolPanelOpen(false);
        }
      },
      [setSaveButtonEnable, activeToolParentId, setActiveToolParentId, setToolPanelOpen]
    );

    const handleOpenPanel = useCallback((parentId: string) => {
      setActiveParentId(parentId);
      setRightPanelOpen(true);
    }, []);

    const handleOpenToolPanel = useCallback(
      
      (parentId: string) => {
        console.log(nodes)
        setActiveToolParentId(parentId);
        setToolPanelOpen(true);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [setActiveToolParentId, setToolPanelOpen]
    );

    const rehydrateNodes = useCallback(
      (incoming: Node[]) =>
        (incoming || []).map((n) => ({
          ...n,
          data: {
            ...((n && n.data) || {}),
            onAdd: handleOpenPanel,
            onDelete: handleDeleteNode,
            onToolAdd: handleOpenToolPanel, 
          },
        })),
      []
    );

    const normalizeEdges = useCallback(
      (incomingEdges: Edge[] = [], nodeSet: Node[] = []) => {
        const nodeIds = new Set((nodeSet || []).map((n) => n.id));
        return (incomingEdges || [])
          .map((e, i) => {
            const id = e.id ?? `e-${e.source}-${e.target}-${i}`;
            const source = e.source;
            const target = e.target;
            const sourceHandle = e.sourceHandle ?? `${source}-out`;
            const targetHandle = e.targetHandle ?? e.targetHandle;
            return {
              ...e,
              id,
              source,
              target,
              sourceHandle,
              targetHandle,
            } as Edge;
          })
          // ensure both nodes exist in current nodes list
          .filter((e) => nodeIds.has(e.source) && nodeIds.has(e.target));
      },
      []
    );

    useEffect(() => {
      const loadWorkflow = async () => {
        if (!id) return;
        try {
          const res = await api.get(`/${id}`);
          const { nodes: serverNodes, connections, viewport, uiState } =
            res.data || {};

          const plainNodes = serverNodes || [];
          const rehydrated = rehydrateNodes(plainNodes);
          const normalized = normalizeEdges(connections || [], plainNodes);

          setNodes(rehydrated);
          setEdges(normalized);

          if (uiState) {
            setActiveParentId(uiState.activeParentId ?? "Add-trigger");
            setFirstNodeAdded(
              uiState.firstNodeAdded ?? plainNodes.length > 0
            );
            setRightPanelOpen(uiState.rightPanelOpen ?? false);
            setSaveButtonEnable(uiState.saveButtonEnable ?? true);
          } else {
            setFirstNodeAdded(plainNodes.length > 0);
          }

          if (viewport) {
            if (reactFlowInstance) {
              reactFlowInstance.setViewport(viewport);
            } else {
              setPendingViewport(viewport);
            }
          }
        } catch (err) {
          console.error("Failed to load workflow:", err);
        }
      };

      loadWorkflow();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, rehydrateNodes, normalizeEdges, reactFlowInstance, setSaveButtonEnable]);

    useEffect(() => {
      if (reactFlowInstance && pendingViewport) {
        reactFlowInstance.setViewport(pendingViewport);
        setPendingViewport(null);
      }
    }, [reactFlowInstance, pendingViewport]);

    
    useEffect(() => {
      function handleEvent() {
        showminimap(true);
        clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // node & edge change handlers
    const onNodesChange = useCallback(
      (changes: any) => {
        setSaveButtonEnable(false);
        setNodes((nds) => applyNodeChanges(changes, nds));
      },
      [setSaveButtonEnable]
    );

    const onEdgesChange = useCallback(
      (changes: any) => {
        setSaveButtonEnable(false);
        setEdges((eds) => applyEdgeChanges(changes, eds));
      },
      [setSaveButtonEnable]
    );

    const onConnect = useCallback(
      (params: any) => {
        setSaveButtonEnable(false);

        const safeParams = {
          ...params,
          sourceHandle: params.sourceHandle ?? `${params.source}-out`,
          targetHandle: params.targetHandle ?? params.targetHandle,
        };

        setEdges((eds) => addEdge(safeParams, eds));
      },
      [setSaveButtonEnable]
    );

    useEffect(() => {
      if (nodes.length === 0) {
        setNodes(rehydrateNodes(initialPlain));
        setEdges([]);
        setRightPanelOpen(false);
        setActiveParentId("Add-trigger");
        setFirstNodeAdded(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodes.length]);

    const handleAddNode = useCallback(
      (type: keyof typeof nodeTypes) => {
        const timestamp = Date.now();
        const newId = `${type}-${timestamp}`;

        const isAIAgent = type === "AIAgentnode";

        if (!firstNodeAdded && activeParentId === "Add-trigger") {
          const triggerNode: Node = {
            id: newId,
            type,
            position: { x: 100, y: 200 },
            data: {
              onAdd: handleOpenPanel,
              onDelete: handleDeleteNode,
              ...(isAIAgent ? { onToolAdd: handleOpenToolPanel } : {}),
            },
          };

          setNodes([triggerNode]);
          setFirstNodeAdded(true);
          setActiveParentId(newId);

          setRightPanelOpen(false);
          return;
        }

        
        const parentNode = nodes.find((n) => n.id === activeParentId);
        if (!parentNode) return;

        const parentPos = parentNode.position ?? { x: 100, y: 200 };
        const newNodePos = { x: parentPos.x + 250, y: parentPos.y };

        const newNode: Node = {
          id: newId,
          type,
          position: newNodePos,
          data: {
            onAdd: handleOpenPanel,
            onDelete: handleDeleteNode,
            ...(isAIAgent ? { onToolAdd: handleOpenToolPanel } : {}),
            label: type, 
            customData: {}
          },
        };

        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) => [
          ...eds,
          {
            id: `e-${activeParentId}-${newId}`,
            source: activeParentId as string,
            sourceHandle: `${activeParentId}-out`,
            target: newId,
    },
        ]);
          const schema = nodeSchemas[type] || [
          { name: "title", label: "Title", type: "text" },
        { name: "description", label: "Description", type: "textarea" },
         ];


        setActiveParentId(newId); 
        setRightPanelOpen(false);
        setSaveButtonEnable(true);
        
        setactiveNodeId(newId);
        setformSchema(schema);
        setformdata({});
        setformopen(true);

      },

      // eslint-disable-next-line react-hooks/exhaustive-deps
      [
        activeParentId,
        nodes,
        firstNodeAdded,
        handleOpenPanel,
        handleDeleteNode,
        
        setSaveButtonEnable,
      ]
    );
  
  const handleAddTool = useCallback(
  (type: keyof typeof nodeTypes) => {
    if (!activeToolParentId) return;

    const timestamp = Date.now();
    const newId = `${type}-${timestamp}`;

    const parentNode = nodes.find((n) => n.id === activeToolParentId);
    if (!parentNode) return;

    const existingToolsCount = nodes.filter(
      (n) =>
        n.type === "Toolnode" &&
        edges.some(
          (e) =>
            e.source === activeToolParentId &&
            e.target === n.id &&
            e.sourceHandle === `${activeToolParentId}-tools`
        )
    ).length;

    const newNodePos = {
      x: parentNode.position.x,
      y: parentNode.position.y + 150 + existingToolsCount * 90,
    };


    const newNode: Node = {
      id: newId,
      type,
      position: newNodePos,
      data: { onDelete: handleDeleteNode },
    };


    const newEdge: Edge = {
      id: `e-${activeToolParentId}-${newId}`,
      source: activeToolParentId,
      sourceHandle: `${activeToolParentId}-tools`,
      target: newId,
      targetHandle: "tool-target",
      style: { strokeDasharray: "5,4" },
    };

    console.log(nodes)
    setNodes((prev) => [...prev, newNode]);
    console.log(nodes)
    setEdges((prev) => [...prev, newEdge]);


    setToolPanelOpen(false);
    setSaveButtonEnable(false);
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [activeToolParentId, nodes, edges, handleDeleteNode]
);




      useEffect(() => {
        const saveWorkflowFn = async () => {
          try {
            if (nodes.length === 0 || !id) {
              // alert("empty workflows")
              return;
            }

            if (!saveButtonEnable) {
              const workflowId = id;

              const flowSnapshot = reactFlowInstance?.toObject();

              await api.put(`/${workflowId}`, {
                nodes,
                connections: edges,
                viewport: flowSnapshot?.viewport,
                uiState: {
                  activeParentId,
                  firstNodeAdded,
                  rightPanelOpen,
                  saveButtonEnable,
                },
              });

              setSaveButtonEnable(true);
            }
          } catch (err) {
            console.error("Failed to save workflow:", err);
          }
        };

        setSaveWorkflow(saveWorkflowFn);
      }, [
        edges,
        id,
        nodes,
        activeParentId,
        firstNodeAdded,
        rightPanelOpen,
        saveButtonEnable,
        setSaveButtonEnable,
        setSaveWorkflow,
        reactFlowInstance,
      ]);

    const hasOutgoingConnection = useCallback(
      (nodeId: string) => edges.some((e) => e.source === nodeId),
      [edges]
    );

    const enhancedNodes = nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        hasOutgoing: hasOutgoingConnection(n.id),
      },
    }));

    const defaultEdgeOptions = {
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "white",
        width: 15,
        height: 15,
      },
      style: { strokeWidth: 2, stroke: "white" }, 
    };

    return (
      <div className="h-full w-full">
        <div className="h-full w-full">
          <ReactFlow
            nodes={enhancedNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            panOnScroll
            selectionOnDrag
            nodeTypes={nodeTypes}
            fitView
            defaultEdgeOptions={defaultEdgeOptions}
          >
            <Background variant={BackgroundVariant.Dots} color="white " bgColor="#2d2e2e" />
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
                flexDirection: "row",    
                gap: "25px",
                width: "auto", 
                position: "fixed",        
                bottom: 20,               
                left: 250,                 
                zIndex: 5,                
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
              fill: white !important;   /* some icons use fill */
              width: 22px !important;   /* increase icon size */
              height: 22px !important;
            }

            .react-flow__controls button {
              background: #2b2f33 !important;
              border-radius: 6px;
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
                  bottom: 80,   
                  left: 30,
                  zIndex: 10,   
                }}
              />
            )}
          </ReactFlow>
          <NodeConfigForm 
              onSubmit={(data) => {
                setNodes((nds) =>
                  nds.map((node) =>
                    node.id === useNodeformStore.getState().activeNodeId
                      ? { ...node, data: { ...node.data, customData: data } }
                      : node
                  )
                );
              }}
          />
          { credentialsformOpen && <Credentialform />}
          <ExecuteWorkflowButton workflowId={id}/>

          <RightPanel
            open={rightPanelOpen}
            setOpen={setRightPanelOpen}
            onClose={() => setRightPanelOpen(false)}
            onAddNode={handleAddNode}
            firstNodeAdded={firstNodeAdded}
          />
          <ToolPanel open={toolPanelOpen} onClose={() => setToolPanelOpen(false)} onAddTool={handleAddTool} />
          
        </div>
      </div>
    );
  }
