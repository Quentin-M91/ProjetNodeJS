import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface ICustomer extends Document {
    name: string;
    adresse: string;
    email: string;
    téléphone: string;
    historiqueAchat: string[];
    status: boolean;
}

// Définir le schéma Mongoose
const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    adresse: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    téléphone: { type: String, required: true, unique: true },
    historiqueAchat: { type: [String], default: [] },
    status: { type: Boolean, default: true }
});

// Exporter le modèle
export default mongoose.model<ICustomer>('Customers', CustomerSchema);