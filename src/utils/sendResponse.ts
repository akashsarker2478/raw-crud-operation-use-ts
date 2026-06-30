import type { ServerResponse } from "http";

export const  sendResponse = (
    res:ServerResponse, 
    statusCode:number,
    success:boolean,
    message:string,
    data?:any,
    
)=>{

    const response = {
        success,
        message,
        data,
        
    }
res.end(JSON.stringify(response));
}