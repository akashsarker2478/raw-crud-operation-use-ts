import fs from "fs"
import path from "path";
import type { IUser } from "../types/user.type";


const filePath = path.join(process.cwd(),"./src/database/user.json")
export const readUsers = () : IUser[]=>{
    const userData = fs.readFileSync(filePath,"utf-8") 
    return JSON.parse(userData)   
}

export const writeUsers = (users : IUser[]) : void  =>{
 const newUser = JSON.stringify(users)
 fs.writeFileSync(filePath,newUser)
}