import { Model, ObjectId } from 'mongoose';

export type TLocationProfile = {
  hubId: ObjectId;
  uid: string;
  hubUid: string;
  locationName: string;
  locationId: string;
  email: string;
  address: string;
  phoneNumber: string;
  currency: string;
  excelFormula: string;
};

export interface LocationProfileModal extends Model<TLocationProfile> {
  findLastOne(): Promise<TLocationProfile>;
}
