// components/triggerPanel.tsx
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MousePointerClick, Globe, Plus } from "lucide-react";
import { FaTelegram } from "react-icons/fa";
import { nodeTypes } from "./canvasWorkspace";

interface RightPanelProps {
  open: boolean;
  onClose?: () => void;
  onAddNode: (type: keyof typeof nodeTypes) => void;
  setOpen: (val: boolean) => void;
  firstNodeAdded?: boolean;
}

export default function RightPanel({
  open,
  onAddNode,
  setOpen,
  firstNodeAdded = false,
}: RightPanelProps) {
  return (
    <div>
      <button
        onClick={() => setOpen(true)}
        className="fixed top-15 right-6 z-50 w-10 h-10 rounded-lg bg-gray-600 text-white flex items-center justify-center shadow-lg hover:bg-gray-400 transition cursor-pointer"
      >
        <Plus className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black"
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-12 right-0 h-full w-90 bg-[#1e1e1e] border-l border-[#333] shadow-lg flex flex-col z-50"
            >
              <div className="p-4 border-b border-[#333] flex justify-between items-center">
                <h2 className="text-white font-medium ">
                  {firstNodeAdded ? "Add Action" : "Choose Trigger"}
                </h2>
                <button
                  onClick={() => setOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 flex flex-col gap-6 text-gray-300 text-sm">
                {!firstNodeAdded ? (
                  <div>
                    <h3 className="text-xs uppercase text-gray-400 mb-2">
                      Triggers
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div
                        className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded-md cursor-pointer"
                        onClick={() => onAddNode("ManualTriggernode")}
                      >
                        <MousePointerClick className="w-5 h-5 text-gray-400" />
                        <span>Trigger manually</span>
                      </div>
                      <div
                        className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded-md cursor-pointer"
                        onClick={() => onAddNode("Webhooknode")}
                      >
                        <Globe className="w-5 h-5 text-gray-400" />
                        <span>On webhook call</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-xs uppercase text-gray-400 mb-2">
                      Actions
                    </h3>
                    <div className="flex flex-col gap-3">
                      <div
                        className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded-md cursor-pointer"
                        onClick={() => onAddNode("Emailnode")}
                      >
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span>Email</span>
                      </div>
                      <div
                        className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded-md cursor-pointer"
                        onClick={() => onAddNode("Telegramnode")}
                      >
                        <FaTelegram className="w-5 h-5 text-gray-400" />
                        <span>Telegram</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
