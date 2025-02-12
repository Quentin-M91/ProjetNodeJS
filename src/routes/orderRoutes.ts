import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { cancelOrder, createOrder, getAllOrder, updateStatus } from "../controllers/orderController";
import { isAdmin } from "../middlewares/verifyAdminMiddleware";


const router = Router();

router.get('/all',verifyTokenMiddleware, getAllOrder);
router.post('/creation',verifyTokenMiddleware, createOrder);
router.put('/statut/:id',isAdmin, updateStatus);
router.put('/annulation/:id',verifyTokenMiddleware, cancelOrder);

export default router;