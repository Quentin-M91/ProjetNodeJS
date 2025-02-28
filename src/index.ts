import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import customerRoutes from "./routes/customerRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import orderRoutes from "./routes/orderRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from './config/swagger';
import cors from 'cors'
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

//Création d'un serveur Express
const app = express();

// Utilisation de cookie-parser
app.use(cookieParser());

//Chargement des variables d'environnement
dotenv.config();

// Activer CORS uniquement pour une seule origine
// curl ifconfig.me pour connaître l'ip publique de votre pc
const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:4200", // Placer le domaine du client pourl'autoriser
    methods: 'GET,POST,DELETE,PUT', // Restreindre les méthodes autorisées
    allowedHeaders: 'Content-Type,Authorization', // Définir les en-têtes acceptés
    credentials: true // Autoriser les cookies et les headers sécurisés
};
app.use(cors(corsOptions));

//Définition du port du serveur
const PORT = process.env.PORT;
console.log(PORT);

//Config du serveur par défaut
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connecter MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('MongoDB connecté avec succès');
    } catch (err) {
        console.error('Erreur lors de la connexion à MongoDB:', err);
        process.exit(1);
    }
};
connectDB();

// Middleware de rate limiting
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // ⏳ temps en millisecondes
    max: 10, // 🔒 Limite à 100 requêtes par IP
    message: "⛔ Trop de requêtes. Réessayez plus tard."
});
// Appliquer le rate limiter sur toutes les routes
app.use(apiLimiter);

// Appliquer express-mongo-sanitize sur les requêtes entrantes
app.use(mongoSanitize());

// Activer helmet pour sécuriser les en-têtes HTTP
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'nonce-random123'"],
                styleSrc: ["'self'"], // Supprimer 'strict-dynamic'
                imgSrc: ["'self'"], // Supprimer 'data:'
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                formAction: ["'self'"],
                frameAncestors: ["'none'"],
                scriptSrcAttr: ["'none'"],
                upgradeInsecureRequests: [],
            },
        },
    })
);

//Ajouter ici les routes
app.use('/api/auth', authRoutes);
app.use('/api/produit', productRoutes);
app.use('/api/client', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/commandes', orderRoutes);

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// 📌 Route pour exporter le `swagger.json`
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs);
});

//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqué
app.listen(PORT, () => {
    console.log('Server is running on port :', PORT);
});
