import { Request, Response } from "express";
import OrderSchema, { IOrder, Status } from "../DBSchemas/OrderSchema";
import ProductSchema, { IProduct } from "../DBSchemas/ProductSchema";
import CustomerSchema from "../DBSchemas/CustomerSchema";

export async function getAllOrder(req: Request, res: Response) {
    try {
        const order = await OrderSchema.find();
        res.status(200).json(order);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des commandes : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes' })

    }
}

export async function createOrder(req: Request, res: Response) {
    try {
        const { clientId, produits, quantités, status } = req.body;

        if (!clientId || !produits || !quantités) {
            res.status(400).json({ message: 'Tous les champs sont requis : cliendId, produits, quantités' });
            return;
        }


        let montantTotal = 0;
        const prixUnitaire: number[] = [];

        for (let i = 0; i < produits.length; i++) {
            const product = await ProductSchema.findById(produits[i]);

            if (!product) {
                res.status(404).json({ message: `Produit avec l'ID ${produits[i]} non trouvé` });
                return;
            }

            if (!product.prix) {
                res.status(404).json({ message: `Prix de ${produits[i]} non trouvé` });
                return;
            }

            if (product.stock < quantités[i]) {
                res.status(400).json({ message: `Quantité insuffisante pour le produit ${product.name}` });
                return;
            }

            // Calcul du montant total
            prixUnitaire.push(product.prix);
            montantTotal += prixUnitaire[i] * quantités[i];

            // Mettre à jour la quantité du produit
            product.stock -= quantités[i];
            await product.save();
        }

        const newOrder: IOrder = new OrderSchema({ produits, quantités, prixUnitaire, status, montantTotal });

        const savedOrder = await newOrder.save();

        // Ajouter l'ID de la commande au tableau achat du client
        const client = await CustomerSchema.findById(clientId);
        if (!client) {
            res.status(404).json({ message: 'Client non trouvé' });
            return;
        }

        client.historiqueAchat.push(savedOrder._id as string);
        await client.save();

        res.status(201).json({ message: 'Commande créée avec succès', data: savedOrder });
    } catch (err: any) {
        if (err.code === 11000) {
            res.status(400).json({ message: 'Commande déjà créée' });
            return;
        }
        res.status(500).json({ message: 'Erreur interne', error: (err as any).message });
        return;
    }
}


export async function updateStatus(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }

        if (status !== Status.Attente && status !== Status.Expediee && status !== Status.Livree) {
            res.status(403).json({ message: 'Etape inconnue' });
            return;
        }

        const order = await OrderSchema.findById(id);

        if (!order) {
            res.status(404).send("Commande non trouvée");
            return;
        }

        // Vérifier les transitions de statut valides
        if (order.status === "En attente" && status !== "Expédiée") {
            res.status(400).json({ message: 'Transition de statut invalide' });
            return;
        }

        if (order.status === "Expédiée" && status !== "Livrée") {
            res.status(400).json({ message: 'Transition de statut invalide' });
            return;
        }

        if (order.status === "Livrée") {
            res.status(400).json({ message: 'La commande est déjà livrée' });
            return;
        }

        if (order.status === "Annulée" && status !== "En attente" && status !== "Expédiée" && status !== "Livrée") {
            res.status(400).json({ message: 'Impossible de faire avancer une commande annulée' });
            return;
        }

        // Mettre à jour le statut et la date de modification
        order.status = status;
        order.dateDeModif = new Date();

        const updatedOrder = await order.save();
        
        res.status(200).json(updatedOrder);

    } catch (err) {
        res.status(500).send("Une erreur est survenu lors de la modification de la commande");
        return;
    }
}


export async function cancelOrder(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { clientId } = req.body;

        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }

        const order = await OrderSchema.findById(id);

        if (!order) {
            res.status(404).json({ message: 'Commande non trouvée' });
            return;
        }

        // Vérifier si la commande est expédiée ou livrée
        if (order.status === "Expédiée" || order.status === "Livrée" || order.status === "Annulée") {
            res.status(400).json({ message: 'Impossible d\'annuler une commande expédiée, livrée ou déjà annulée.' });
            return;
        }

        // Restaurer le stock des produits
        for (let i = 0; i < order.produits.length; i++) {
            const product = await ProductSchema.findById(order.produits[i]);

            if (product) {
                product.stock += order.quantités[i];
                await product.save();
            }
        }

        // Annuler la commande
        await OrderSchema.findById(id);        

        const client = await CustomerSchema.findById(clientId);
        if (!client) {
            res.status(404).json({ message: 'Client non trouvé' });
            return;
        }

        const orderIndex = client.historiqueAchat.indexOf(id);
        if (orderIndex > -1) {
            client.historiqueAchat.splice(orderIndex, 1);
        }

        order.status = Status.Annulee;

        await order.save();

        await client.save();

        res.status(200).json({ message: 'Commande annulée et stock restauré' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur interne', error: (err as any).message });
        return;
    }
}
