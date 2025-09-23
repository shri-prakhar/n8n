import { ChatOllama } from "@langchain/ollama";
import { DynamicStructuredTool, Tool } from "langchain/tools";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { prisma } from "@repo/db";


async function buildTools(nodedata: any): Promise<Tool[]> {
  return nodedata.data.tools.map((t: any) =>
    new DynamicStructuredTool({
      name: t.customData.name,
      description: t.customData.description,
      schema: t.customData.schema ?? { type: "object", properties: {}, required: [] },
      func: async (input: unknown) => {
        const parsedInput = typeof input === "string" ? JSON.parse(input) : input ?? {};
        try {
          const fn = eval(t.customData.code);
          const schemaKeys = t.customData.schema?.properties
            ? Object.keys(t.customData.schema.properties)
            : Object.keys(parsedInput);
          const args = fn.length === 1 ? parsedInput : schemaKeys.map(k => parsedInput[k]);
          const result = await fn(...args);
          return typeof result === "object" ? JSON.stringify(result) : result.toString();
        } catch (err) {
          return `ERROR: ${String(err)}`;
        }
      },
    })
  );
}


export default async function AI_AGENT(nodedata: any, userId: string) {
  const credential = await prisma.credentials.findFirst({ 
    where: { title: nodedata.data.customData.credentials, userId } 
  });

  const model = new ChatOllama({
    baseUrl: "http://localhost:11434",
    model: "llama2:7b",
  });

  const tools = await buildTools(nodedata);

  
  async function callLLM(state: typeof MessagesAnnotation.State) {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
  }

  
  async function callTool(state: typeof MessagesAnnotation.State) {
    const lastMessage = state.messages[state.messages.length - 1] as AIMessage;
    if (!lastMessage.tool_calls?.length) return { messages: [] };

    const results: any[] = [];
    for (const call of lastMessage.tool_calls) {
      const tool = tools.find(t => t.name === call.name);
      if (tool) {
        const result = await tool.invoke(call.args);
        results.push(new HumanMessage(JSON.stringify(result)));
      }
    }
    return { messages: results };
  }

  function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
    const last = messages[messages.length - 1] as AIMessage;
    if (last.tool_calls?.length) return "toolNode";
    return "__end__";
  }

  
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("agentNode", callLLM)
    .addNode("toolNode", callTool)
    .addEdge("__start__", "agentNode")
    .addEdge("toolNode", "agentNode")
    .addConditionalEdges("agentNode", shouldContinue);

  const app = workflow.compile();

  const finalState = await app.invoke({
    messages: [new HumanMessage(nodedata.data.customData.prompt)],
  });
  console.log(finalState.messages[finalState.messages.length - 1]?.content;)
  return finalState.messages[finalState.messages.length - 1]?.content;
}
