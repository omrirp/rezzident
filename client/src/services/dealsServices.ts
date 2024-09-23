import axios from 'axios';
import { Deal } from '../models/deal';
import { Account } from '../models/account';
import { Company } from '../models/company';

export const getDeals = async (companyId: Company['_id'], token: Account['token']): Promise<Deal[]> => {
  const res = await axios.get<Deal[]>(`http://localhost:3001/api/deals/deals/${companyId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const convertedDeals: Deal[] = res.data.map((deal) => ({ ...deal, date: new Date(deal.date) }));

  return convertedDeals;
};
