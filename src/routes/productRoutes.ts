import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { getAllProduct, createProduct, updateProduct } from "../controllers/productController";

const router = Router();

router.get('/all',verifyTokenMiddleware, getAllProduct);
router.post('/create',verifyTokenMiddleware, createProduct);
router.put('/update/:id',verifyTokenMiddleware, updateProduct);


export default router;
