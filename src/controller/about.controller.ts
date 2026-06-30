import type { IncomingMessage, ServerResponse } from "http";

export const aboutController = (
    req : IncomingMessage,
    res : ServerResponse
)=>{
const url = req.url;
const method = req.method;

if(url === "/about" && method=== "GET"){

    const person = [
        {
            id :1,
            name:'Akash sarker'
        }
    ]
    res.writeHead(200,{'content-type':'application/json'});
    res.end(JSON.stringify({message : 'this is our website about part',person}))
}
}