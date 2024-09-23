import { Account } from './account';
import { Company } from './company';

export interface Deal {
  accountId: Account['_id'];
  companyId: Company['_id'];
  date: Date;
  commissionFee: number;
  currency: 'USD' | 'NIS' | 'UER';
}
