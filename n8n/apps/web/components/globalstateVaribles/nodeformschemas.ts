
export const nodeSchemas: Record<string, any[]> = {
  Webhooknode: [
    { name: "url", label: "Webhook URL", type: "text" },
    { name: "method", label: "HTTP Method", type: "select", options: ["GET", "POST", "PUT", "DELETE"] },
  ],
  Emailnode: [
    { name: "credentials" , placeholder: "Select Credential", label:" " , type:"select" , options:["Create new credentials"]},
    { name: "operation" , placeholder: "Select Operation", label:"Select Operation" , type:"select" , options:["Send" , "Wait for a response"]},
    { name: "from", label: "From Email",  placeholder: "admin@example.com",type: "email" },
    { name: "to", label: "To Email",  placeholder: "info@example.com",type: "email" },
    { name: "subject", label: "Subject ",placeholder: "My Subject line", type: "text" },
    { name: "format" , placeholder: "Select format", label:"Email Format" , type:"select" , options:["HTML" , "Text"]},
    { name: "message", label: "Message", type: "textarea" },
  ],
  AIAgentnode: [
    { name: "credentials" , placeholder: "Select Credential", label:" " , type:"select" , options:["Create new credentials"]},
    { name: "prompt", label: "Prompt", type: "textarea" },
    { name: "temperature", label: "Temperature", type: "number" },
  ],
  Telegramnode:[
    { name: "credentials" , placeholder: "Select Credential", label:"Credential to connect with" , type:"select" , options:["Create new credentials"]},
    { name: "resource" , placeholder: "Select Resource", label:"Resource" , type:"select" , options:["Chat" , "Callback" , "File" , "Message"]},
    { name: "chatid" , placeholder: "", label:"Chat Id" , type:"text"},
    { name: "chat", label: "chat", type: "textarea" },
  ],
  Toolnode:[
    { name : "name" , placeholder:"Function Name" , label:"Function Name" , type:"text"},
    { name : "description" , placeholder:"Call this tool to get a random color . The input should a string with comma separated names of colors to exclude." , label:"Description"  , type:"textarea"},
    { name : "language" , placeholder:"Select language" , label:"Language" , type:"select" , options:["Javascript" , "Python"]},
    { name: "code", label: "Code", type: "textarea" },
    { name: "schema", label: "Schema(optional)", type: "textarea" },
  ]
};
