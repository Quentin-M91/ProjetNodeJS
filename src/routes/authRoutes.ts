import { Router } from "express";
import { getAllUsers, login, permission, register } from "../controllers/authControllers";
import { isAdmin } from "../middlewares/verifyAdminMiddleware";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users',verifyTokenMiddleware, getAllUsers);
router.put('/permissions/:id',isAdmin, permission);

export default router;
