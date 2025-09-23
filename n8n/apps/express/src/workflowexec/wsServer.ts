import  { WebSocket, WebSocketServer } from "ws";


let wss : WebSocketServer | null = null;
const subscriptions = new Map<WebSocket , String>();


export function startWebsocketserver(serverPort:number=Number(process.env.WS_PORT || 8081) ) {
    if (wss){ return wss } 

    wss = new WebSocketServer({port:serverPort});

    wss.on("connection" , (socket:WebSocket)=>{
        console.log("ws server started")
        socket.on("messsage" , (msg)=>{
            try{
                const parsed = JSON.parse(msg.toString())
                if (parsed.type == "subscribe" && parsed.WorkflowId){
                    subscriptions.set(socket , parsed.WorkflowId)
                    console.log("client subscribed")
                }
                if (parsed.type == "unsubscribe"){
                    subscriptions.delete(socket)
                    console.log("client unsubscribed");
                }
            }catch(e:unknown){
                console.log("client Unsubscribed")
            }
        })
        socket.on("close" , () => {
            subscriptions.delete(socket)
        })
    })
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
                if (obj?.WorkflowId && obj.WorkflowId == sub){
                    c.send(msg)
                }
            }
        }   
    })
} 