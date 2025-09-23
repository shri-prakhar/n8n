import { prisma } from "@repo/db";
import nodemailer from "nodemailer";

export default async function send_Mail(nodedata:any , userId:string){

  const title:string = nodedata.data.customData.credentials;
const credential = await prisma.credentials.findFirst({
    where:{
        title,
        userId:userId,

    }
})  


if (credential?.data) {

    const credentialData = credential.data as {
    user:string,
    password:string,  
    host: string;
    port: number;
    
  };
  let SMTP_HOST = credentialData.host; 
  let SMTP_PORT = 587; 
  let secure = false; 
  if (credentialData.port === 465) {
    SMTP_PORT = 465;
    secure = true; 
  }

  const SMTP_USER = credentialData.user;
  const SMTP_PASS = credentialData.password;

  
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: secure, 
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  try {
    if(nodedata.data.customData.format == "HTML"){
      await transporter.sendMail({
      from: nodedata.data.customData.from,
      to: nodedata.data.customData.to,
      subject: nodedata.data.customData.subject,
      html: nodedata.data.customData.message,
    });
    } 
    if(nodedata.data.customData.format == "Text"){
      await transporter.sendMail({
      from: nodedata.data.customData.from,
      to: nodedata.data.customData.to,
      subject: nodedata.data.customData.subject,
      text: nodedata.data.customData.message,
    });
    } 

    const result = {success:true , msg:"Email sent"}
    return result
  } catch (err) {
    console.error("Error sending email:", err);
    const result = {success:false , msg:"Email not  sent"}
    return result;
  }
} else {
  throw new Error("No valid credential data found");
}
}