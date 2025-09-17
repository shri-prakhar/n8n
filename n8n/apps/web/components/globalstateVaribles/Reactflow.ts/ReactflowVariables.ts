// globalstateVaribles/Reactflow.ts/ReactflowVariables.ts
import { create } from "zustand";

interface SaveButtonState {
  saveButtonEnable: boolean;
  setSaveButtonEnable: (value: boolean) => void;

  saveWorkflow: (() => void) | null;
  setSaveWorkflow: (fn: () => void) => void;

}

export const useSaveButtonStore = create<SaveButtonState>((set) => ({
  saveButtonEnable: false,
  setSaveButtonEnable: (value: boolean) => set({ saveButtonEnable: value }),

  saveWorkflow: null,
  setSaveWorkflow: (fn) => set({ saveWorkflow: fn }),

}));

interface toolpanelStore {
  

  
  toolPanelOpen: boolean;
  setToolPanelOpen: (v: boolean) => void;

  
  activeToolParentId: string | null;
  setActiveToolParentId: (id: string | null) => void;
}

export const usetoolpanelStore = create<toolpanelStore>((set) => ({
  
  toolPanelOpen: false,
  setToolPanelOpen: (v: boolean) => set({ toolPanelOpen: v }),

  activeToolParentId: null,
  setActiveToolParentId: (id: string | null) => set({ activeToolParentId: id }),
}));

interface FeildConfig{
  name : string;
  label : string ;
  type  : "text" | "number" | "select" |  "email" | "textarea";
  placeholder:string;
  options? : string[]
}

interface NodeformSchema {
  formOpen : boolean;
  formSchema : FeildConfig[];
  activeNodeId : string |null ;
  formdata:Record<string , any>;
  setformopen:(open: boolean ) => void;
  setformSchema:(schema : FeildConfig[] ) => void ;
  setactiveNodeId : (id : string | null) => void ;
  setformdata: (data : Record<string,any>) => void;
}

export const useNodeformStore = create<NodeformSchema>((set) => ({
  formOpen: false,
  formSchema: [],
  activeNodeId: null,
  formdata:{},
  setformopen:(formOpen)=> set({formOpen}),
  setformSchema:(formSchema)=> set({formSchema}),
  setactiveNodeId:(activeNodeId)=> set({activeNodeId}),
  setformdata:(formdata)=> set({formdata}),
  
}))