import { model, Schema } from 'mongoose';
import { ILeadsAndClients, LeadsAndClients } from './leadsAndClients.interface';

const LeadsAndClientsSchema = new Schema<LeadsAndClients, ILeadsAndClients>(
  {
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
    hubId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Hub id is required'],
    },
    spokeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Spoke id is required'],
    },
    fieldOfficerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Field officer id is required'],
    },
    uid: {
      type: String,
      required: [true, 'Lead client UID is required'],
      unique: true,
    },
    isClient: { type: Boolean, default: false },
    customFields: {
      type: Map,
      of: Schema.Types.Mixed, // value can be string, number, date, etc.
      default: {},
    }
  },
  {
    timestamps: true,
  },
);



LeadsAndClientsSchema.statics.findLastOne = async function () {
  return await this.findOne({}, null, { bypassMiddleware: true })
    .select('uid')
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();
}



const LeadsAndClientsModel = model<LeadsAndClients, ILeadsAndClients>(
  'LeadsAndClients',
  LeadsAndClientsSchema,
);

export default LeadsAndClientsModel;
