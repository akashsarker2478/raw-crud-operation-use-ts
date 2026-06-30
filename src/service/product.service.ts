import fs from "fs"
import path from "path"
import type { IProduct } from "../types/product.type";

const filePath = path.join(process.cwd(),'./src/database/db.json')

export const productRead = ()=>{
    // console.log(filePath)
    const products = fs.readFileSync(filePath,'utf-8');
    // console.log(products.toString())
    return JSON.parse(products);
}

export const writeProduct = (products : IProduct[])  : void=>{

    const textData = JSON.stringify(products)
    fs.writeFileSync(filePath,textData)
}