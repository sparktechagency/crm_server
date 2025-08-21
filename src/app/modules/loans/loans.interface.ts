import { Model } from 'mongoose';

export type TLoan = {
  uid: string;
  title: string;
  features: string[];
  isActive: boolean;
};

export interface LoanModel extends Model<TLoan> {
  findLastOne(): Promise<TLoan>;
}
