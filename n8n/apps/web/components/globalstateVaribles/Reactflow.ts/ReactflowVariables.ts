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

interface CredentialsformSchema {
  credentialsformOpen : boolean;
  saveCredButtonEnable : boolean;
  credentialsformSchema : FeildConfig[];
  credentialsformdata:Record<string , any>;
  setcredentialsformopen:(open: boolean ) => void;
  setcredentialsformSchema:(schema : FeildConfig[] ) => void ;
  setcredentialsformdata: (data : Record<string,any>) => void;
  setsaveCredButtonEnable : (enable: boolean) => void;
  credentialsOptions: string[];
  addCredentialOption: (label: string) => void;
  resetCredentialOption : () => void;
}

export const useCredentialsformStore = create<CredentialsformSchema>((set) => ({
  credentialsformOpen: false,
  saveCredButtonEnable : false,
  credentialsformSchema: [],
  credentialsformdata:{},
  setcredentialsformopen:(credentialsformOpen)=> set({credentialsformOpen}),
  setcredentialsformSchema:(credentialsformSchema)=> set({credentialsformSchema}),
  setcredentialsformdata:(credentialsformdata)=> set({credentialsformdata}),
  setsaveCredButtonEnable : (saveCredButtonEnable) => set({saveCredButtonEnable}),
  credentialsOptions: [],
  addCredentialOption: (label) =>
    set((state) => ({
      credentialsOptions: [...state.credentialsOptions, label],
    })),
    
    resetCredentialOption : () => set({credentialsOptions : []}),
  }))

interface Nodeform{
  nodeOutputs : Record <string , any>;
  setnodeOutputs : (nodeId :string  , output: any) => void;

}


export const useNodeOutputstore = create<Nodeform>((set) => ({
  nodeOutputs : {},
  setnodeOutputs : (nodeId , output) => 
    set((state) => ({
      nodeOutputs: {  ...state.nodeOutputs , [nodeId]:  output}
    }))
}))