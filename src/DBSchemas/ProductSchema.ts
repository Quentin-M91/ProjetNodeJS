import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

export interface IProduct extends Document {
    name: string;
    description: string;
    stock: number;
}

// Définir le schéma Mongoose
const ProductSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true }
});

// Exporter le modèle
export default mongoose.model<IProduct>('Product', ProductSchema);