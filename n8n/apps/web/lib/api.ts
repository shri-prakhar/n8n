
import axios from "axios"
export type SignInForm = { email: string; password: string };
export type SignUpForm = { name: string; email: string; password: string };
export type workflowtype = { title: string; enabled:boolean; nodes:JSON; connections:JSON};

const api = axios.create({
  baseURL: "http://localhost:3030/api/v1", 
  withCredentials: true 
});

export async function signUpApi(payload: SignUpForm) {
  try{
    const res = await api.post("/signup", payload);
    alert ("signed up successfully")
    console.log(res)

    return res.data;
  }catch(e:unknown){
      alert ("invalid format")
        console.error(e)
      throw new Error("invalid")
  }
}

export async function signInApi(payload: SignInForm) {
  try {
    const res = await api.post("/signin", payload);
  alert ("signed in successfully")
  console.log(res)
  return res.data;
}catch(e:unknown){
    alert ("invalid username or password")
    console.log(e)
    throw new Error("invalid")
  }
}

export default api