import { model, Schema } from 'mongoose';
import { LeadsAndClients } from './leadsAndClients.interface';

const LeadsAndClientsSchema = new Schema<LeadsAndClients>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      unique: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
    },
    image: { type: String, required: [true, 'Image is required'] },
    address: { type: String, required: [true, 'Address is required'] },
    hubId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    spokeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    leadClientUid: {
      type: String,
      required: [true, 'Lead client UID is required'],
      unique: true,
    },
    isClient: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const LeadsAndClientsModel = model<LeadsAndClients>(
  'LeadsAndClients',
  LeadsAndClientsSchema,
);

export default LeadsAndClientsModel;
