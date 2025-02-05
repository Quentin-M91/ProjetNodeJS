import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { createCustomer, getAllCustomer, getClientActif, isActifCustomer, updateCustomer } from "../controllers/customerController";

const router = Router();

router.get('/all',verifyTokenMiddleware, getAllCustomer);
router.post('/create',verifyTokenMiddleware, createCustomer);
router.put('/update/:id',verifyTokenMiddleware, updateCustomer);
router.put('/update/actif/:id',verifyTokenMiddleware, isActifCustomer);
router.get('/all/actif',verifyTokenMiddleware, getClientActif);


export default router;
