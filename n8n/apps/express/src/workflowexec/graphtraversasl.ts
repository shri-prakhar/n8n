import { queue } from "./worker.js";


export default async function Traversegraph(workflow:any , executiionId:string ){
    const {nodes , connections ,userId } = workflow;

    const adj : Record<string, string[]> = {}
    const indegree : Record <string , number> = {}

    nodes.forEach((n:any) => {
        adj[n.id] = [];
        indegree[n.id] = 0;
    }
    )

    connections.forEach((n:any) => {
        //@ts-ignore
        adj[n.source]?.push(n.target)
        indegree[n.target] = (indegree[n.target] || 0)+ 1 ;
    })

      const Queue: string[] = nodes
    .filter((n: any, index: number) =>  indegree[n.id] === 0) // Skip the first node
    .map((n: any) => n.id);


    while (Queue.length){
        const nodeId  =  Queue.shift() ;
        const node = nodes.find((n:any) => n.id == nodeId)

        if (!node) continue;

        await  queue.add(`node-${node.id}`, {executiionId , node , userId })
        console.log(`added node-${node.id}`)

        //@ts-ignore
        adj[nodeId].forEach((next:any)=>{
            //@ts-ignore
            indegree[next]--;
            if (indegree[next] == 0) Queue.push(next);  
        })
    }
}