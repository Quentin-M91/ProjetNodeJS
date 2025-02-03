import express from 'express';
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware';
import { protectedTest } from '../controllers/protectedController';

const router=express.Router();

router.get('/protected', verifyTokenMiddleware, protectedTest);

export default router;