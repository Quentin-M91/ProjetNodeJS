import { Router } from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { createCustomer, getAllCustomer, getClientActif, isActifCustomer, updateCustomer } from "../controllers/customerController";
import { isAdmin } from "../middlewares/verifyAdminMiddleware";

const router = Router();

/**
 * @swagger
 * /api/client/all:
 *   get:
 *     summary: Récupère tous les clients
 *     description: Retourne la liste de tous les clients. Nécessite un token valide.
 *     tags:
 *       - Clients
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erreur lors de la récupération des clients.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la récupération des clients
 */
router.get('/all',verifyTokenMiddleware, getAllCustomer);

/**
 * @swagger
 * /api/client/create:
 *   post:
 *     summary: Crée un nouveau client
 *     description: Crée un nouveau client avec les informations fournies.
 *     tags:
 *       - Clients
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       201:
 *         description: Client créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       500:
 *         description: Erreur lors de la création du client.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la création du client
 */
router.post('/create',verifyTokenMiddleware, createCustomer);

/**
 * @swagger
 * /api/client/update/{id}:
 *   put:
 *     summary: Met à jour un client
 *     description: Met à jour un client en fonction de son ID.
 *     tags:
 *       - Clients
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du client
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Customer'
 *     responses:
 *       200:
 *         description: Client mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Client non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour du client.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la mise à jour du client
 */
router.put('/update/:id',verifyTokenMiddleware, updateCustomer);

/**
 * @swagger
 * /api/client/update/actif/{id}:
 *   put:
 *     summary: Active ou désactive un client
 *     description: Active ou désactive un client en fonction de son ID.
 *     tags:
 *       - Clients
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du client
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *                 description: Statut du client (true ou false).
 *     responses:
 *       200:
 *         description: Client activé ou désactivé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Client non trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Client non trouvé
 *       500:
 *         description: Erreur lors de la modification du client.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.put('/update/actif/:id',isAdmin, isActifCustomer);

/**
 * @swagger
 * /api/client/all/actif:
 *   get:
 *     summary: Récupère tous les clients actifs
 *     description: Retourne la liste de tous les clients actifs. Nécessite un token valide.
 *     tags:
 *       - Clients
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des clients actifs récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Clients actifs récupérés avec succès
 *                 activeClients:
 *                   type: array
 *                   items:
 *                     type: object
 *       404:
 *         description: Aucun client actif trouvé.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aucun client actif trouvé
 *       500:
 *         description: Erreur lors de la récupération des clients actifs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/all/actif',verifyTokenMiddleware, getClientActif);


export default router;
