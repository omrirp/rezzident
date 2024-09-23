import { Location } from './asset';

export interface Company {
  _id: string;
  companyName: string;
  isActive: boolean;
  companyLocation: Location['_id'];
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
}
