import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId; 
  email: string;
  passwordHash: string; 
  encryptionSalt: string; 
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  encryptionSalt: { type: String, required: true },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
