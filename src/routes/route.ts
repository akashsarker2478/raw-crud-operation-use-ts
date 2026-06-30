import type { IncomingMessage, ServerResponse } from "http";
import { productController } from "../controller/product.controller";
import { aboutController } from "../controller/about.controller";
import { userController } from "../controller/user.controller";

export const routeHandler = (req : IncomingMessage,res : ServerResponse)=>{

    const url = req.url;
    const method = req.method;


    if(url === "/" && method === 'GET'){
        // console.log('this is root route')
    res.writeHead(200,{'content-type' : 'application/json'})
    res.end(JSON.stringify({message:'this is root route'}))

    }
    else if(url==='/products' || url?.startsWith('/products/')){
    productController(req,res)
    } 
    else if(url?.startsWith('/about')){
        aboutController(req,res)
    } else if(url === '/users' || url?.startsWith('/users/')){
        userController(req,res)
    }
    else{
     res.writeHead(404,{'content-type' : 'application/json'})
    res.end(JSON.stringify({message:'route not found'}))
}
}