import React from "react";

export default function NodeCanvasPlaceholder() {
  return (
    <div className="flex gap-4 p-6">
      <div className="w-56 p-3 shadow rounded bg-white">Trigger node</div>
      <div className="w-56 p-3 shadow rounded bg-white">Function node</div>
      <div className="w-56 p-3 shadow rounded bg-white">Action node</div>
    </div>
  );
}
