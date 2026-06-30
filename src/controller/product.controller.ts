import type { IncomingMessage, ServerResponse } from "http";
import { productRead, writeProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseRequestBody } from "../utils/bodyParser";
import { sendResponse } from "../utils/sendResponse";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  const url = req.url || "";
  const method = req.method;

  const urlParts = url.split("/");
  const productId = Number(urlParts[2]);

  // 1. Get All Products
  if (url === "/products" && method === "GET") {
    const products = productRead();
    return sendResponse(res, 200, true, "Products fetched successfully", products);
  } 
  
  // 2. Get Single Product by ID
  else if (url.startsWith('/products/') && method === "GET") {
    const products = productRead();
    const singleProduct = products.find((p: IProduct) => p.id === productId);

    if (singleProduct) {
      // 🌟 ফিক্সড: সিরিয়াল অনুযায়ী res, statusCode, success, message, data পাস করা হয়েছে
      return sendResponse(res, 200, true, "Product fetched successfully", singleProduct);
    } else {
      // 🌟 ফিক্সড: প্রোডাক্ট না পাওয়া গেলে স্ট্যাটাস কোড 404 এবং success হবে false
      return sendResponse(res, 404, false, `Product with ID ${productId} not found`);
    }
  } 
  
  // 3. Post Product
  else if (url === "/products" && method === 'POST') {
    try {
      const newProductData = await parseRequestBody(req);
      const products: IProduct[] = productRead();
      const newId = products.length > 0 ? products[products.length - 1]!.id + 1 : 1;
      
      const newProduct: IProduct = {
        id: newId,
        name: newProductData.name,
        des: newProductData.des,
        price: Number(newProductData.price)
      };
      
      products.push(newProduct);
      writeProduct(products);

      return sendResponse(res, 201, true, "Product added successfully", newProduct); // 🌟 নতুন কিছু তৈরি হলে স্ট্যাটাস ২০১ দেওয়া স্ট্যান্ডার্ড
    } catch (error) {
      return sendResponse(res, 400, false, "Invalid JSON data received!");
    }
  }
  
  // 4. Fallback Route
  else {
    return sendResponse(res, 404, false, "Route or Method not handled yet!");
  }
}; 