import { Company } from './company';

export interface Account {
  // Real estate agent
  _id: string;
  firstName: string;
  lastName: string;
  companyId: Company['_id'];
  email: string;
  phone: string;
  createdAt: Date;
  position: string;
  isActive: boolean;
  isLocked: boolean;
  avatar: string;
  role: 'Admin' | 'Client' | 'Agent';
  token: string;
  plan: 'Basic' | 'Premium' | 'Platinum';
}

export interface Agent extends Omit<Account, 'token' | 'companyId'> {}
