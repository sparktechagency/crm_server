import { Model } from 'mongoose';

export type TLocationProfile = {
  locationProfileHubId: string;
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
