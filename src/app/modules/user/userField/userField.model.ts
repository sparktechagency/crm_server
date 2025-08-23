import mongoose, { InferSchemaType, Schema } from 'mongoose';
import { TFieldInterface } from '../../../interface';

const UserFieldSchema = new Schema<TFieldInterface>(
  {
    label: { type: String, required: true, unique: true },
    inputName: { type: String, required: true, unique: true }, // this is schema name also
    inputType: {
      type: String,
      enum: ['text', 'number', 'boolean', 'date', 'enum', 'email', 'file'],
      required: true,
    },
    required: { type: Boolean, default: false },
    placeholder: { type: String },
    options: [{ type: String }],
    defaultValue: Schema.Types.Mixed,
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export type TUserField = InferSchemaType<typeof UserFieldSchema>;
export const UserField = mongoose.model('UserField', UserFieldSchema);
