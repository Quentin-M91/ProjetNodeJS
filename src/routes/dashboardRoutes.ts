import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { getAllStock } from "../controllers/dashboardController";

const router = Router();

router.get('/stock',verifyTokenMiddleware, getAllStock);


export default router;