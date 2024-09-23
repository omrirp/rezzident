import { Company } from './company';

export interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyId: Company['_id'];
  createdAt: Date;
  updatedAt: Date;
}
