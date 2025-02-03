import { Request, Response } from 'express';
import { hashPassword, verifyPassword } from '../utils/pwdUtils';
import UserSchema, { IUser } from '../DBSchemas/UserSchema';
import { generateToken } from '../utils/JWTUtils';

export async function register(req:Request, res:Response){
    try{
    const {name,email,password, isActive,age} = req.body;
    if(!name ||!email|| !password){
        res.status(400).send('Champs manquant: name ou password');
        return 
    }
    //hashage
    const hashedPassword= await hashPassword(password);

    //creer nouvel utilisateur
    const newUser:IUser= new UserSchema({name,email,hashedPassword,isActive,age});
    //on sauvegarde
    const savedUser= await newUser.save();

    //on supprime le hashed password
    savedUser.hashedPassword='';

    res.status(201).json({message: 'Utilisateur créé avec succès',data: savedUser});
} catch(err:any){
    //erreur de duplication 
    if(err.code===11000){
        res.status(400).json({message: 'Cet Email est déjà utilisé'});
        return 
    }
    res.status(500).json({message: 'Erreur interne', error: err.message});

}
}

export async function login(req:Request, res:Response){
    const {email,password}=req.body;
    try{
         const user= await  UserSchema.findOne({email});
            if(!user){
                res.status(404).json({message: 'Utilisateur non trouvé'});
                return 
            }
            const isPasswordValid= await verifyPassword(password,user.hashedPassword);

            if(!isPasswordValid){
                res.status(401).json({message: 'Mot de passe incorrect'});
                return 
            }
            const token = generateToken({id:user._id,email:user.email});
            res.cookie('jwt',token,{httpOnly:true, sameSite:'strict'});
            res.status(200).json({message: 'Connexion réussie'});

    }catch(error:any){
        res.status(500).json({message: error.message});
    }
}