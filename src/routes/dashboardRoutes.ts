import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { getAllStock, getChiffreAffaires } from "../controllers/dashboardController";

const router = Router();

router.get('/stock',verifyTokenMiddleware, getAllStock);
router.get('/commandes/:month/:year',verifyTokenMiddleware, getChiffreAffaires);

export default router;