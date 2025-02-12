import { Request, Response } from "express";
import ProductSchema, { IProduct } from "../DBSchemas/ProductSchema";
import OrderSchema from "../DBSchemas/OrderSchema";


export async function getAllStock(req: Request, res: Response) {
    try {
        const stockProduct = await ProductSchema.find();
        res.status(200).json(stockProduct);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des clients : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des clients' })

    }
}