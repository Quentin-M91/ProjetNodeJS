import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { cancelOrder, createOrder, getAllOrder, updateStatus } from "../controllers/orderController";
import { isAdmin } from "../middlewares/verifyAdminMiddleware";


const router = Router();

/**
 * @swagger
 * /api/commandes/all:
 *   get:
 *     summary: Récupère toutes les commandes
 *     description: Retourne la liste de toutes les commandes. Nécessite un token valide.
 *     tags:
 *       - Commandes
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des commandes récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erreur lors de la récupération des commandes.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la récupération des commandes
 */
router.get('/all',verifyTokenMiddleware, getAllOrder);

/**
 * @swagger
 * /api/commandes/creation:
 *   post:
 *     summary: Crée une commande
 *     description: Crée une commande en fonction des informations fournies. Nécessite un token valide.
 *     tags:
 *       - Commandes
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Commande créée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       500:
 *         description: Erreur lors de la création de la commande.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la création de la commande
 */
router.post('/creation',verifyTokenMiddleware, createOrder);

/**
 * @swagger
 * /api/commandes/statut/{id}:
 *   put:
 *     summary: Met à jour le statut d'une commande
 *     description: Permet à un administrateur de modifier le statut d'une commande donnée.
 *     tags:
 *       - Commandes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant unique de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Attente, Expediee, Livree]
 *                 description: Le nouveau statut de la commande
 *     responses:
 *       200:
 *         description: Statut de la commande mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Requête invalide (ID manquant, transition invalide, etc.).
 *       403:
 *         description: Étape inconnue.
 *       404:
 *         description: Commande non trouvée.
 *       500:
 *         description: Erreur serveur lors de la mise à jour de la commande.
 */
router.put('/statut/:id',isAdmin, updateStatus);

/**
 * @swagger
 * /api/commandes/annulation/{id}:
 *   put:
 *     summary: Annule une commande
 *     description: Permet à un utilisateur d'annuler une commande si elle n'a pas encore été expédiée ou livrée.
 *     tags:
 *       - Commandes
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: L'identifiant unique de la commande
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientId:
 *                 type: string
 *                 description: L'identifiant unique du client
 *     responses:
 *       200:
 *         description: Commande annulée avec succès et stock restauré.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Impossible d'annuler une commande expédiée, livrée ou déjà annulée.
 *       404:
 *         description: Commande ou client non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.put('/annulation/:id',verifyTokenMiddleware, cancelOrder);

export default router;