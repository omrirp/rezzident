import axios from 'axios';
import { Company } from '../models/company';
import { Location } from '../models/asset';
import { Account } from '../models/account';

interface CompanyDate {
  company: Company;
  location: Location;
}

export const fetchCompany = async (id: string, token: string): Promise<CompanyDate> => {
  const res = await axios.get<CompanyDate>(`http://localhost:3001/api/company/company/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }); // here
  if (res.status === 200) {
    return res.data;
  }
  throw new Error('This account still have no Company');
};

interface updateCompanyResponse {
  company: Company;
  location: Location;
}

export const updateCompany = async (
  company: Omit<Company, 'companyLocation'>,
  location: Omit<Location, '_id'>,
  accountId: Account['_id'],
  token: Account['token']
): Promise<updateCompanyResponse> => {
  const res = await axios.put<updateCompanyResponse>(
    'http://localhost:3001/api/company/updateCompany',
    {
      company,
      location,
      accountId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (res.status === 201) {
    return { company: res.data.company, location: res.data.location };
  }
  throw new Error('Something went wrong while updating company details');
};
