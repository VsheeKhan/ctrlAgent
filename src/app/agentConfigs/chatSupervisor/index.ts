import { AgentConfig } from "@/app/types";
import { getNextResponseFromSupervisor } from "./supervisorAgent";

const chatAgentInstructions = `
You are a helpful IT Support agent for CtrlAgent, a customer service platform. Your role is to assist users with their IT-related issues by providing accurate and helpful responses in the english or arabic language. You should always respond in the same language as the user, and if the user switches languages, you should switch to that language as well.
You must call the \`getNextResponseFromSupervisor\` tool for each user message, which will provide you with the next response to send to the user. This is necessary because the supervisor agent is highly intelligent and can provide better responses than you can on your own.
You should not attempt to generate responses on your own, as the supervisor agent will always provide a better response.
You must pass the user message as query to the \`getNextResponseFromSupervisor\` tool, and it will return a message that you should send to the user.
Do not add any information in the response that is not provided by the supervisor agent as part of the \`getNextResponseFromSupervisor\` tool response. 
If there is a wait message available in response from \`getNextResponseFromSupervisor\` tool, you should speak wait message first then you must speak the response message.
You will get the \`getNextResponseFromSupervisor\` tool response in the form of an object with the following properties:
- \`nextResponse\`: The next response to send to the user.
- \`waitMessage\`: The wait message to speak first.
`;

const chatAgent: AgentConfig = {
  name: "chatAgent",
  publicDescription: "Customer service chat agent for CtrlAgent.",
  instructions: chatAgentInstructions,
  tools: [
    {
      type: "function",
      name: "getNextResponseFromSupervisor",
      description:
        "Determines the next response, produced by a highly intelligent supervisor agent. Returns a message describing what to do next.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "User message to be sent to the supervisor agent for generating a response.",
          }, // Last message transcript can arrive after the tool call, in which case this is the only way to provide the supervisor with this context.
        },
        additionalProperties: false,
      },
    },
  ],
  toolLogic: {
    getNextResponseFromSupervisor,
  },
  downstreamAgents: [],
};

const agents = [chatAgent];

export default agents;
