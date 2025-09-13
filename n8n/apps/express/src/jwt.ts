import jwt  from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

export const generatetoken =  (id:string):string =>{
    return jwt.sign(id , process.env.JWT_SECRET as string)
}

export const decodetoken = (token : string ):string =>{
    const decoded = jwt.verify(token , process.env.JWT_SECRET as string ).toString();
    return decoded
}