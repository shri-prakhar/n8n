"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CanvasNotification({
  message,
  onClose,
}: {
  message: string | null;
  onClose: () => void;
}) {
  // auto-hide after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onClose(), 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ x: 300, opacity: 0 }} // start off-screen right
          animate={{ x: 0, opacity: 1 }}   // slide into view
          exit={{ x: 300, opacity: 0 }}    // slide out on exit
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="fixed bottom-5 right-5 bg-[#2d2e2e] text-white 
                     px-6 py-4 rounded-xl shadow-xl z-50 text-lg w-[300px]"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
