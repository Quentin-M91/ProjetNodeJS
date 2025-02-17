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


//Création d'un serveur Express
const app = express();

// Utilisation de cookie-parser
app.use(cookieParser());

//Chargement des variables d'environnement
dotenv.config();

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

//Ajouter ici les routes
app.use('/api/auth', authRoutes);
app.use('/api/produit', productRoutes);
app.use('/api/client', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/commandes', orderRoutes);

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqué
app.listen(PORT, () => {
    console.log('Server is running on port :', PORT);
});
