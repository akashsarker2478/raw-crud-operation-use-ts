import type { IncomingMessage, ServerResponse } from "http";
import { productRead, writeProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseRequestBody } from "../utils/bodyParser";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url || "";
  const method = req.method;

//   console.log("user url:", url);

  const urlParts = url.split("/");
  const productId = Number(urlParts[2]);

//   console.log("after split : ", urlParts);


  //get all products
  if (url === "/products" && method === "GET") {
    const products = productRead();
    res.writeHead(200, { "content-type": "application/json" });
    res.end(
      JSON.stringify({ message: "this is product route", data: products }),
    );
  } else if(url.startsWith('/products/') && method === "GET"){
    const products = productRead()
    const singleProduct = products.find ((p : IProduct)=>p.id === productId)

    if(singleProduct){
        res.writeHead(200,{"content-type" : "application/json"})
        res.end(
            JSON.stringify({data : singleProduct})
        )
    }else{
    res.writeHead(404,{"content-type" : "application/json"})
    res.end(
        JSON.stringify({message : `Product with ID ${productId} not found`})
    )
  }
  } 
    //post product
  else if(url === "/products" && method === 'POST'){
    try{
      const newProductData = await parseRequestBody(req)

    const products :IProduct[] = productRead()
    const newId = products.length > 0 ? products[products.length -1]!.id + 1 : 1;
    const newProduct : IProduct = {
      id : newId,
      name : newProductData.name,
      des : newProductData.des,
      price  :Number(newProductData.price)

    }
    products.push(newProduct)
    writeProduct(products)

    res.writeHead(200, {"content-type" : "application/json"})
    res.end(
      JSON.stringify({message : "product added successfully",data:newProduct})
    )
  } catch(error){
      res.writeHead(404, { "content-type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid JSON data received!" }));
    }
    }
};


