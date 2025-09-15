import { motion, AnimatePresence } from "framer-motion";
import { Hammer } from "lucide-react";
import { nodeTypes } from "./canvasWorkspace";

interface ToolPanelProps {
  open: boolean;
  onClose?: () => void;
  onAddTool: (type: keyof typeof nodeTypes) => void;
}

export default function ToolPanel({ open, onClose, onAddTool }: ToolPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-12 right-0 h-full w-80 bg-[#1e1e1e] border-l border-[#333] shadow-lg flex flex-col z-50"
          >
            <div className="p-4 border-b border-[#333] flex justify-between items-center">
              <h2 className="text-white font-medium">AI Agent Tools</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            <div className="p-4 flex flex-col gap-3 text-gray-300 text-sm">
              <div
                className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded-md cursor-pointer"
                onClick={() => onAddTool("Toolnode")}
              >
                <Hammer className="w-5 h-5 text-purple-400" />
                <span>Tool</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
