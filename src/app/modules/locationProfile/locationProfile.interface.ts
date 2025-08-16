import { ObjectId } from 'mongoose';

export type TLocationProfile = {
  hubId: ObjectId;
  locationName: string;
  locationId: string;
  email: string;
  address: string;
  phoneNumber: string;
  currency: string;
  excelFormula: string;
};
