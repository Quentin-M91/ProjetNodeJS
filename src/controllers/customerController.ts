import { Request, Response } from "express";
import CustomerSchema, { ICustomer } from "../DBSchemas/CustomerSchema";

export async function getAllCustomer(req: Request, res: Response) {
    try {
        const customer = await CustomerSchema.find();
        res.status(200).json(customer);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des clients : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des clients' })

    }
}

export async function createCustomer(req: Request, res: Response) {
    try {
        const { name, adresse, email, téléphone } = await req.body;

        if (!name || !adresse || !email || !téléphone) {
            res.status(400).json({ message: 'Tous les champs sont requis : name, adresse, email, téléphone' });
            return;
        }

        // Validation du nom, de l'adresse, de l'email et du téléphone avec une regex
        const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z])?[a-zA-Z]*)*$/;
        const adressRegex = /^[a-zA-Z0-9\s,'-]*$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;

        if (!nameRegex.test(name) || !adressRegex.test(adresse) || !emailRegex.test(email) || !phoneRegex.test(téléphone)) {
            if (!nameRegex.test(name)) {
                res.status(400).json({ message: 'Nom invalide, il doit contenir que des lettres' });
            }
            if (!adressRegex.test(adresse)) {
                res.status(400).json({ message: 'Adresse invalide, elle doit contenir que des lettres, des chiffres et des espaces' });
            }
            if (!emailRegex.test(email)) {
                res.status(400).json({ message: 'Email invalide, elle doit etre sous la forme : exemple@exemple.ex' });
            }
            if (!phoneRegex.test(téléphone)) {
                res.status(400).json({ message: 'Téléphone invalide, il doit être sous la forme : 0X XX XX XX XX ou +33 X XX XX XX XX' });
            }
            return;
        }

        const newCustomer: ICustomer = new CustomerSchema({ name, adresse, email, téléphone });

        const savedCustomer = await newCustomer.save();

        res.status(201).json({ message: 'Clients créé avec succès', data: savedCustomer });
    } catch (err: any) {

        if (err.code === 11000) {
            res.status(400).json({ message: 'Clients déjà créé' });
            return;
        }
        res.status(500).json({ message: 'Erreur interne', error: err.message });
        return;
    }
}

export const updateCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { name, adresse, email, téléphone } = req.body;

        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }

        // Validation du nom, de l'adresse, de l'email et du téléphone avec une regex
        const nameRegex = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
        const adressRegex = /^[a-zA-Z0-9\s,'-]*$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/;

        if (!nameRegex.test(name) || !adressRegex.test(adresse) || !emailRegex.test(email) || !phoneRegex.test(téléphone)) {
            if (!nameRegex.test(name)) {
                res.status(400).json({ message: 'Nom invalide, il doit contenir que des lettres' });
                return;
            }
            if (!adressRegex.test(adresse)) {
                res.status(400).json({ message: 'Adresse invalide, elle doit contenir que des lettres, des chiffres et des espaces' });
                return;
            }
            if (!emailRegex.test(email)) {
                res.status(400).json({ message: 'Email invalide, elle doit etre sous la forme : exemple@exemple.ex' });
                return;
            }
            if (!phoneRegex.test(téléphone)) {
                res.status(400).json({ message: 'Téléphone invalide, il doit être sous la forme : 0X XX XX XX XX ou +33 X XX XX XX XX' });
                return;
            }
        }

        const updateCustomer = await CustomerSchema.findByIdAndUpdate(
            id,
            { name, adresse, email, téléphone },
            { new: true }
        ).exec();

        if (!updateCustomer) {
            res.status(404).send("Client pas trouver");
            return;
        }

        res.status(200).json(updateCustomer);
    } catch (err) {
        res.status(500).send("Une erreur est survenu lors de la modification du client");
        return;
    }
};


export const isActifCustomer = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }

        const isActifCustomer = await CustomerSchema.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).exec();

        if (!isActifCustomer) {
            res.status(404).send("Client pas trouver");
            return;
        }

        res.status(200).json(isActifCustomer);
    } catch (err) {
        res.status(500).send("Une erreur est survenu lors de la modification du client");
        return;
    }
};

export async function getClientActif(req: Request, res: Response) {
    try {
        // Récupérer tous les clients avec un statut inactif
        const activeClients = await CustomerSchema.find({ status: true });

        // Vérifier si des clients inactifs existent
        if (activeClients.length === 0) {
            res.status(404).json({ message: 'Aucun client actif trouvé' });
            return;
        }

        // Renvoyer la liste des clients inactifs
        res.status(200).json({ message: 'Clients actifs récupérés avec succès', activeClients });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: 'Erreur lors de la récupération des clients actifs' });
    }
}


