import { model, Schema } from 'mongoose';
import {
  LocationProfileModal,
  TLocationProfile,
} from './locationProfile.interface';

const locationProfileSchema = new Schema<
  TLocationProfile,
  LocationProfileModal
>(
  {
    hubId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Hub id is required'],
      unique: true,
    },
    uid: {
      type: String,
      required: [true, 'UID is required'],
      unique: true,
    },
    locationName: {
      type: String,
      required: [true, 'Location name is required'],
    },
    locationId: {
      type: String,
      required: [true, 'Location id is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    currency: {
      type: String,
      required: [true, 'Currency is required'],
    },
    excelFormula: {
      type: String,
      required: [true, 'Excel formula is required'],
    },
  },
  {
    timestamps: true,
  },
);

locationProfileSchema.statics.findLastOne = async function () {
  return await this.findOne({}, null, { bypassMiddleware: true })
    .select('uid')
    .sort({ createdAt: -1 })
    .limit(1)
    .lean();
};

const LocationProfile = model<TLocationProfile, LocationProfileModal>(
  'LocationProfile',
  locationProfileSchema,
);

export default LocationProfile;
