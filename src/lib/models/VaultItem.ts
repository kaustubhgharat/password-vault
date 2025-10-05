// src/lib/models/VaultItem.ts
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IVaultItem extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  url: string;
  encryptedUsername: string;
  encryptedPassword: string;
  encryptedNotes: string;
}

const VaultItemSchema: Schema<IVaultItem> = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  url: { type: String, default: '' },
  encryptedUsername: { type: String, required: true },
  encryptedPassword: { type: String, required: true },
  encryptedNotes: { type: String, default: '' },
}, { timestamps: true });

export const VaultItem: Model<IVaultItem> = mongoose.models.VaultItem || mongoose.model<IVaultItem>('VaultItem', VaultItemSchema);