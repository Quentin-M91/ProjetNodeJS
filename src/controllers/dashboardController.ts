import { Request, Response } from "express";
import ProductSchema, { IProduct } from "../DBSchemas/ProductSchema";
import OrderSchema, { Status } from "../DBSchemas/OrderSchema";


export async function getAllStock(req: Request, res: Response) {
    try {
        const stockProduct = await ProductSchema.find();
        res.status(200).json(stockProduct);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des clients : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des clients' })
    }
}

export async function getChiffreAffaires(req: Request, res: Response) {
    const { month, year } = req.params;
    try {
        // Vérification des paramètres
        if (!month || !year) {
            res.status(400).json({ message: `Le mois et l'année sont requis` });
            return;
        }

        // Calculer le premier et dernier jour du mois
        const firstDay = new Date(parseInt(year), parseInt(month) - 1, 1);
        const lastDay = new Date(parseInt(year), parseInt(month), 0);

        // Utiliser la constante du statut "Annulée" pour éviter les erreurs de casse
        const commandes = await OrderSchema.find({
            dateDeCréation: { $gte: firstDay, $lte: lastDay },
            status: { $ne: Status.Annulee }  // Utilisation de Status.Annulée ici
        });

        // Si aucune commande n'est trouvée
        if (commandes.length === 0) {
            res.status(404).json({ message: `Aucune commande trouvée pour ce mois (vérifiez l'année)` });
            return;
        }

        // Calculer le total des montants des commandes
        const totalParMois = commandes.reduce((acc, order) => acc + order.montantTotal, 0);

        // Retourner le total des commandes du mois
        res.status(200).json({ message: 'Total des commandes récupéré avec succès', totalParMois });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la récupération du total des commandes' });
    }
}