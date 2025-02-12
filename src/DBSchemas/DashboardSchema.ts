import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface IOrder extends Document {
    produits: string[];
    quantités: number;
    prixUnitaire: number;
    dateDeCréation: Date;
    dateDeModif: Date;
    status: string;
    montantTotal: number;
}

// Définir le schéma Mongoose
const OrderSchema: Schema = new Schema({
    produits: { type: [String], default: [] },
    quantités: { type: Number, required: true },
    prixUnitaire: { type: Number, required: true },
    dateDeCréation: { type: Date, default: Date.now },
    dateDeModif: { type: Date, default: Date.now },
    status: { type: String, default: true },
    montantTotal: { type: Number, default: true },
});

// Exporter le modèle
export default mongoose.model<IOrder>('Order', OrderSchema);