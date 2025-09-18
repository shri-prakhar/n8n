
export const credSchemas: Record<string, any[]> = {
  Emailnode: [
    { name: "user", label: "User",  placeholder: "",type: "text" },
    { name: "password", label: "Password",  placeholder: "",type: "text" },
    { name: "host", label: "Host",  placeholder: "",type: "text" },
    { name: "port", label: "Port",  placeholder: "",type: "text" },
    { name: "hostname", label: "Client Host Name", type: "text" },
  ],
  AIAgentnode: [
    { name: "host", label: "Host",  placeholder: "",type: "text" },
    { name: "apikey", label: "API Key",  placeholder: "",type: "text" },
  ],
  Telegramnode:[
    { name: "access token", label: "Access Token",  placeholder: "",type: "text" },
    { name: "base", label: "Base Url",  placeholder: "",type: "text" },
    
  ],
};
