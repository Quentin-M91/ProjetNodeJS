import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/pwdUtils';
import UserSchema, { IUser } from '../DBSchemas/UserSchema';
import { generateToken } from '../utils/JWTUtils';

export async function getAllUsers(req: Request, res: Response) {
    try {
        const user = await UserSchema.find();
        res.status(200).json(user);
    } catch (err: any) {
        console.error('Erreur lors de la récupération des clients : ', err)
        res.status(500).json({ message: 'Erreur lors de la récupération des clients' })

    }
}

export async function register(req: Request, res: Response) {
    try {
        const { name, password } = req.body;
        if (!name || !password) {
            res.status(400).send('Champs manquant: name ou password');
            return
        }
        //hashage
        const hashedPassword = await hashPassword(password);

        //Creer nouvel utilisateur
        const newUser: IUser = new UserSchema({ name, hashedPassword });
        //on sauvegarde
        const savedUser = await newUser.save();

        //on supprime le hashed password
        savedUser.hashedPassword = '';

        res.status(201).json({ message: 'Utilisateur créé avec succès', data: savedUser });
    } catch (err: any) {
        //erreur de duplication 
        if (err.code === 11000) {
            res.status(400).json({ message: 'Ce nom est déjà utilisé' });
            return
        }
        res.status(500).json({ message: 'Erreur interne', error: err.message });

    }
}

export async function login(req: Request, res: Response) {
    const { name, password } = req.body;
    try {
        const user = await UserSchema.findOne({ name });
        if (!user) {
            res.status(404).json({ message: 'Utilisateur non trouvé' });
            return
        }
        const isPasswordValid = await verifyPassword(password, user.hashedPassword);

        if (!isPasswordValid) {
            res.status(401).json({ message: 'Mot de passe incorrect' });
            return
        }
        const token = generateToken({ id: user._id, name: user.name, role: user.role });
        res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict' });
        res.status(200).json({ message: 'Connexion réussie' });

    } catch (error: any) {
        res.status(500).json({ message: error.message });
        return
    }
}


export async function permission(req: Request, res: Response) {
    try {
        const { id } = req.params;
        const { role } = req.body;
       
        if (!id) {
            res.status(400).send("Invalid ID");
            return;
        }

        const updatedUser = await UserSchema.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).exec();

        if (!updatedUser) {
            res.status(404).send("Utilisateur pas trouver");
            return;
        }
        res.status(200).json(updatedUser);

    } catch (err) {
        res.status(500).send("Une erreur est survenu lors de la modification de l'utilisateur");
        return;
    }
}