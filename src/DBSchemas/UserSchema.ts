import mongoose, { Schema, Document } from 'mongoose';
// Interface TypeScript pour le document utilisateur

enum Role {
    Admin = "Admin",
    Employé = "Employé",
}

const userRole: Role = Role.Employé;

export interface IUser extends Document {
    name: string;
    hashedPassword: string;
    role: Role;
}

// Définir le schéma Mongoose
const UserSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: Object.values(Role), default: userRole } // Role ajouté par défaut "employé"
});

// Exporter le modèle
export default mongoose.model<IUser>('User', UserSchema);