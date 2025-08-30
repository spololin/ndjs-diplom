import mongoose from 'mongoose';

export type Role = 'client' | 'admin' | 'manager';
export type Id = mongoose.Types.ObjectId;
