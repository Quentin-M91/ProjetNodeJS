import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface IUser extends Document {
    name: string;
    hashedPassword: string;
    role: string;
}

// Définir le schéma Mongoose
const UserSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, default: "employé" } // Role ajouté par défaut "employé"
});

// Exporter le modèle
export default mongoose.model<IUser>('User', UserSchema);