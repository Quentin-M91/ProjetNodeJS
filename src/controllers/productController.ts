import { Request, Response } from "express";
import ProductSchema, { IProduct } from "../DBSchemas/ProductSchema";

export async function getAllProduct(req: Request, res: Response) {
    try {
        const products = await ProductSchema.find();
        res.status(200).json(products);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des produits : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des produits' })

    }
}

export async function createProduct(req: Request, res: Response) {
    try {
        const { name, description, prix, stock } = await req.body;

        if (!name || !description || !prix || !stock) {
            res.status(400).json({ message: 'Tous les champs sont requis : name, description, prix, stock'});
            return;
        }

        const newProduct: IProduct = new ProductSchema({ name, description, prix, stock });

        const savedProduct = await newProduct.save();

        res.status(201).json({ message: 'Produit créé avec succès', data: savedProduct });
    } catch (err: any) {

        if (err.code === 11000) {
            res.status(400).json({ message: 'Produit déjà utilisé' });
            return;
        }
        res.status(500).json({ message: 'Erreur interne', error: err.message });
        return;
    }
}

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, description, prix, stock } = req.body;

        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }

        const updatedProduct = await ProductSchema.findByIdAndUpdate(
            id,
            { name, description, prix, stock },
            { new: true }
        ).exec();

        if (!updatedProduct) {
            res.status(404).send("Produit pas trouver");
            return;
        }

        res.status(200).json(updatedProduct);
    } catch (err) {
        res.status(500).send("Une erreur est survenu lors de la modification du produit");
        return;
    }
};



