import bcrypt from "bcryptjs";

export const hashpassword = async (password: string , gen_salt: number): Promise<string> => {
    const hashpassword =  await bcrypt.hash(password , gen_salt)
    return hashpassword
}

export const comparepassword = async (password: string , user_password: string): Promise<boolean> => {
    return  await bcrypt.compare(password , user_password)
}
