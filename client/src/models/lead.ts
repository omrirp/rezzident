import { Agent } from './account';
import { Company } from './company';

export interface LogMessage {
  _id: string;
  date: string;
  message: string;
}

export interface Lead {
  _id: string;
  companyId: Company['_id'];
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  isHot: boolean;
  agents: Agent['_id'][];
  createdAt: Date; // timestamps
  updatedAt: Date; // timestamps
  log: LogMessage[];
}
