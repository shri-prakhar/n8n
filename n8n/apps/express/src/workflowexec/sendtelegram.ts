import { prisma } from "@repo/db"
import axios from "axios"

export default async function sendTelegram_message(nodedata:any, userId:string){
    const title = nodedata.data.customData.credentials

    const credential = await prisma.credentials.findFirst({
        where:{
            title,
            userId
        }
    })
    let url =""
    if (credential?.data){
        const credentialData = credential.data as {
            access_token :  string,
        }
        const token = credentialData.access_token
        url  = `https://api.telegram.org/bot${token}/sendMessage`;


    }
    try {
    const chatid = nodedata.data.customData.chatid
    const chat = nodedata.data.customData.chat
    console.log(chatid, chat)
    const res = await axios.post(url, {
      chat_id: chatid,
      text:chat,
    });

    if (!res.data.ok) {
      throw new Error(`Telegram error: ${JSON.stringify(res.data)}`);
    }
    console.log(res)

    const result = {success:true , msg:"Telegram chat sent"}
    return result
  } catch (err: any) {
    const result = {success:false , msg:"Telegram chat not sent"}
    return result
  }
}
