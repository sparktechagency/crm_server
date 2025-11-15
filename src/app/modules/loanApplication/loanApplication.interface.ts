import { Model, ObjectId } from 'mongoose';

export type TApplicationStatus = 'pending' | 'approved' | 'rejected' | 'closed';

export interface IRepaymentsDates {
  month: string;
  dueDate: string;
  status?: 'pending' | 'paid';
  _id?: string;
}

export type TLoanApplication = {
  _id?: string;
  // common
  clientId: ObjectId;
  locationProfileHubId: ObjectId;
  locationSpokeId: ObjectId;
  fieldOfficerId: ObjectId;
  uid: string;
  leadUid: string;

  // lead info
  email: string;
  phoneNumber: string;
  homeAddress: string;
  name: string;
  image: string;

  // loan info
  applicantStatus: 'New' | 'From Leads';
  typeofFinancingRequested: string;
  purposeOfFinancing: string;
  loanAmountRequested: number;
  installMentAmount: number;
  employmentStatus: string;
  totalRepayment: number;
  grossProfit: number;
  whereAreYouLocated: string;
  monthlyIncome: number;
  preferredContact: string;
  term: string;
  nid: string;
  repaymentsDates: IRepaymentsDates[];
  startDate: Date;
  endDate: Date;
  loanStatus: TApplicationStatus;
  supervisorApproval: TApplicationStatus;
  hubManagerApproval: TApplicationStatus;
};

export interface LoanApplicationModel extends Model<TLoanApplication> {
  findLastOne(): Promise<TLoanApplication>;
}
