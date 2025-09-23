import { useEffect, useRef } from "react";

export default function useWebsocket(workflowId: string, onMessage: (msg: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8081");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("✅ WebSocket connected");
      ws.send(JSON.stringify({ type: "subscribe", WorkflowId: workflowId }));
    };

    ws.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        console.log(parsed)
        onMessage(parsed);
      } catch (e) {
        console.error("Failed to parse WS message", e);
      }
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("❌ WebSocket closed");
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: "unsubscribe" }));
      }
      ws.close();
    };
  }, []);

  return wsRef;
}
