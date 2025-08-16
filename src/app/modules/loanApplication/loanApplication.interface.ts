import { ObjectId } from 'mongoose';

type TApplicationStatus = 'pending' | 'approved' | 'rejected';

export type TLoanApplication = {
  clientId: ObjectId;
  hubId: ObjectId;
  spokeId: ObjectId;
  loanApplicationUid: string;
  applicantStatus: 'New' | 'From Leads';
  typeofFinancingRequested: string;
  purposeOfFinancing: string;
  loanAmountRequested: number;
  installMentAmount: number;
  employmentStatus: string;
  whereAreYouLocated: string;
  monthlyIncome: number;
  preferredContact: string;
  term: string;
  nid: string;
  startDate: Date;
  endDate: Date;
  leadUid: string;
  loanStatus: TApplicationStatus;
  supervisorApproval: TApplicationStatus;
  hubManagerApproval: TApplicationStatus;
};
