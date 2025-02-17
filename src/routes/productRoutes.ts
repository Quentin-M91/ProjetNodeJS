import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { getAllProduct, createProduct, updateProduct } from "../controllers/productController";

const router = Router();

/**
 * @swagger
 * /api/produit/all:
 *   get:
 *     summary: Récupère tous les produits
 *     description: Retourne la liste de tous les produits. Nécessite un token valide.
 *     tags:
 *       - Produits
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des produits récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erreur lors de la récupération des produits.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la récupération des produits
 */
router.get('/all',verifyTokenMiddleware, getAllProduct);

/**
 * @swagger
 * /api/produit/create:
 *   post:
 *     summary: Crée un produit
 *     description: Crée un produit en fonction des informations fournies. Nécessite un token valide.
 *     tags:
 *       - Produits
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               prix:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Produit créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Tous les champs sont requis.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       500:
 *         description: Erreur lors de la création du produit.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.post('/create',verifyTokenMiddleware, createProduct);

/**
 * @swagger
 * /api/produit/update/{id}:
 *   put:
 *     summary: Met à jour un produit
 *     description: Met à jour un produit en fonction de son ID. Nécessite un token valide.
 *     tags:
 *       - Produits
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du produit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               prix:
 *                 type: number
 *               stock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Produit mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: ID invalide.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       404:
 *         description: Produit pas trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       500:
 *         description: Erreur lors de la modification du produit.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 */
router.put('/update/:id',verifyTokenMiddleware, updateProduct);


export default router;
