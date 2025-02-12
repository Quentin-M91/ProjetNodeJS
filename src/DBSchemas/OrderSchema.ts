import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export enum Status {
    Attente = "En attente",
    Expediee = "Expédiée",
    Livree = "Livrée",
    Annulee = "Annulée",
}


export interface IOrder extends Document {
    produits: string[];
    quantités: number[];
    prixUnitaire: number;
    dateDeCréation: Date;
    dateDeModif: Date;
    status: Status;
    montantTotal: number[];
}

// Définir le schéma Mongoose
const OrderSchema: Schema = new Schema({
    produits: { type: [String], default: [] },
    quantités: { type: [Number], default: [] },
    prixUnitaire: { type: [Number], default: [] },
    dateDeCréation: { type: Date, default: Date.now },
    dateDeModif: { type: Date, default: Date.now },
    status: { type: String, enum: Object.values(Status), default: Status.Attente },
    montantTotal: { type: Number },
});

// Exporter le modèle
export default mongoose.model<IOrder>('Order', OrderSchema);