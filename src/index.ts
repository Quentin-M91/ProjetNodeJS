import express from "express";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from "./routes/authRoutes";

//Création d'un serveur Express
const app = express();

//Chargement des variables d'environnement
dotenv.config();

//Définition du port du serveur
const PORT = process.env.PORT;
console.log(PORT);

//Config du serveur par défaut
app.use(express.json());

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


//app.listen indique au serveur d'écouter les requêtes HTTP arrivant sur le
//port indiqué
app.listen(3000, () => {
    console.log('Server is running on port :', PORT);
});
