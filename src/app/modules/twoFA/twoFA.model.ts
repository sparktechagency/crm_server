import { model, Schema } from 'mongoose';
import { TTwoFA } from './twoFA.interface';
import bcrypt from 'bcrypt';

const twoFaSchema = new Schema<TTwoFA>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
    },
    password: { type: String, required: [true, 'Password is required'] },
  },
  {
    timestamps: true,
  },
);

twoFaSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const TwoFA = model<TTwoFA>('TwoFA', twoFaSchema);
