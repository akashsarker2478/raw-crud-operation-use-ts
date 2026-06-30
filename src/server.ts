import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { routeHandler } from "./routes/route";
import dotenv from "dotenv"

dotenv.config();
const PORT = process.env.PORT || 5000;

const server : Server = createServer((req : IncomingMessage,res : ServerResponse)=>{
    // console.log(req.url)
    // console.log(req.method)
    routeHandler(req,res)
}) 

server.listen(PORT,()=>{
    console.log(`server is running on the port ${PORT}`)
})