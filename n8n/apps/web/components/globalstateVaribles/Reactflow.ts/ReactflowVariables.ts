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