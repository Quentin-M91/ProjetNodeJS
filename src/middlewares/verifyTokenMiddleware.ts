import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/JWTUtils';

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

export function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (SECRET_KEY === undefined) {
        throw new Error('SECRET KEY is not defined');
    }
    const cookie = req.headers.cookie;
    if (!cookie) {
        res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
        return;
    }
    const token = cookie.split('=')[1];
    console.log(token);

    if (!token) {
        res.status(401).json({ message: 'Vous devez être connecté pour accéder à cette ressource' });
        return;
    }
    try {
        const decoded = verifyToken(token);
        req.headers.user = JSON.stringify(decoded);
        next();
        if (!decoded) {
            res.status(403).send({ message: 'Token Invalide ou Expiré' });
        }

    } catch (error) {
        res.status(401).send({ message: 'Vous n\'êtes pas autorisé à accéder à cette ressource' });
        return;
    }
}