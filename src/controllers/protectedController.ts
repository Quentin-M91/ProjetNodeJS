import { Request, Response } from 'express';


export function protectedTest(req:Request, res:Response){
    const decodeUser=req.headers.user;
    res.status(200).send(decodeUser);
}