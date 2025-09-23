import  { WebSocket, WebSocketServer } from "ws";


let wss : WebSocketServer | null = null;
const subscriptions = new Map<WebSocket , String>();




export function startWebsocketserver() {
  if (wss) {
    console.log("⚠️ WebSocket server already running");
    return wss;
  }

  wss = new WebSocketServer({ port: 8081 });
  console.log("✅ started ws server on :8081");

  wss.on("connection", (socket: WebSocket) => {
    console.log("🟢 client connected");

    socket.on("message", (msg) => {
      try {
        const parsed = JSON.parse(msg.toString());
        if (parsed.type === "subscribe" && parsed.WorkflowId) {
          subscriptions.set(socket, parsed.WorkflowId);
          console.log("client subscribed:", parsed.WorkflowId);
        } else if (parsed.type === "unsubscribe") {
          subscriptions.delete(socket);
          console.log("client unsubscribed");
        }
      } catch (e) {
        console.log("invalid message from client", e);
      }
    });

    socket.on("close", () => {
      subscriptions.delete(socket);
      console.log("🔴 client disconnected");
    });
  });

  return wss;
}

export function broadcastMessage (message:any ){
    if (!wss) return

    const msg = typeof message === "string" ? message : JSON.stringify(message)
    let obj:any =null
    try{
        
        obj = typeof message === "string" ? JSON.parse(message) : message ;

    }catch(e:unknown){
        console.error("Invalid Json")
    }
    wss.clients.forEach((c) => {
        if (c.readyState === WebSocket.OPEN){
            const sub = subscriptions.get(c)
            if (!sub){
                c.send("not subscribed")
            }else{
                
                    c.send(msg)
                
            }
        }   
    })
} 