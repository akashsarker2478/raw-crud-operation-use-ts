import { ServerResponse, type IncomingMessage } from "http";
import { readUsers, writeUsers } from "../service/user.service";
import { parseRequestBody } from "../utils/bodyParser";
import type { IUser } from "../types/user.type";
import { sendResponse } from "../utils/sendResponse";


export const userController = async (
    req : IncomingMessage,
    res  :ServerResponse
) =>{
    const url = req.url || "";
    const method = req.method;
    //get user
    if (url === "/users" && method === "GET"){
        const users = readUsers()
        // res.writeHead(200,{"content-type" : "application/json"})
        // res.end(
        //     JSON.stringify({message:"Users fetched successfully", data:users})
        // )
        sendResponse(res,200,true,"Users fetched successfully",users)

        //post user
    } else if(url === "/users" && method==="POST") {
        try{

           const newUserData = await parseRequestBody(req)
           const users : IUser[] = readUsers()
           const newId = users.length > 0 ?users[users.length - 1]!.id +1 : 1;
            const newUser : IUser = {
                id : newId,
                name : newUserData.name,
                email: newUserData.email,
                role : newUserData.role || "user"
            }

            users.push(newUser)
            writeUsers(users)

            sendResponse(res,200,true,"user added Successfully",newUser)

            // res.writeHead(200,{"content-type" : "application/json"})
            // res.end(JSON.stringify({message : "user added Successfully" , data :newUser}))

        }catch(error){

            sendResponse(res,400,false,"Invalid JSON data received!")
            // res.writeHead(400,{"content-type" : "application,json"})
            // res.end(JSON.stringify({ message: "Invalid JSON data received!" }));
        }
        //delete user
    } else if(url.startsWith("/users/") && method ==="DELETE"){
        try{

            const urlParts = url.split("/");
            const userId = parseInt(urlParts[urlParts.length -1] || '');
            if (isNaN(userId)) {
                res.writeHead(400, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: "Invalid User ID!" }));
                return;
            }

            const users : IUser[] = readUsers()
            const remainingUser = users.filter(user=>user.id !== userId)

            if(users.length === remainingUser.length){
                res.writeHead(404,{"content-type" : "application/json"})
                res.end(JSON.stringify({ message: "User not found!" }));
                return;
            }

            writeUsers(remainingUser)
            res.writeHead(200,{"content-type" :   "application/json"})
            res.end(JSON.stringify({message: `user with ID ${userId} deleted successfully`}))

        } catch(error){
            res.writeHead(500, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "Internal Server Error" }));
        }
        //update user
    } else if(url.startsWith("/users/") && method === "PUT"){
        try{

            const urlParts = url.split('/')
            const userId = parseInt(urlParts[urlParts.length -1] || "");

            if(isNaN(userId)){
                res.writeHead(400,{"content-type" : "application/json"})
                res.end(JSON.stringify({message: "Invalid User ID!"}))
            }

            const updateData = await parseRequestBody(req)
            const users : IUser[] = readUsers()

            const userIndex = users.findIndex(user =>user.id === userId)

            if (userIndex === -1) {
                res.writeHead(404, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: "User not found to update!" }));
                return;
            }

            const updatedUser : IUser = {
                ...users[userIndex]!,
                name : updateData.name || users[userIndex]!.name,
                role : updateData.role || users[userIndex]!.role
            } 

            users[userIndex] = updatedUser;
            writeUsers(users)

            res.writeHead(200,{"content-type" : "application/json"})
            res.end(JSON.stringify({message: "User updated successfully",data:updatedUser}))

        }catch(error){
            res.writeHead(400, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "Invalid JSON data received!" }));
        }
    }
    
    else{
        res.writeHead(404,{"content-type" : "application/json"})
        res.end(JSON.stringify({message : "Route or Method not handled yet!"}))
    }
}