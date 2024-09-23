import { Client } from '../models/client';
import axios from 'axios';
import { Account } from '../models/account';

export const createNewClient = async (
  clientData: Omit<Client, '_id' | 'createdAt' | 'updatedAt'>,
  token: Account['token']
): Promise<Client> => {
  const res = await axios.post<Client>('http://localhost:3001/api/clients/client', clientData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchClientsByCompanyId = async (companyId: string, token: Account['token']): Promise<Client[]> => {
  const res = await axios.get<Client[]>(`http://localhost:3001/api/clients/clients/${companyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const editClient = async (
  clientData: Omit<Client, 'createdAt' | 'updatedAt' | 'companyId'>,
  token: Account['token']
): Promise<Client> => {
  const res = await axios.put<Client>(`http://localhost:3001/api/clients/client`, clientData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteClient = async (clientId: Client['_id'], token: Account['token']): Promise<void> => {
  await axios.delete(`http://localhost:3001/api/clients/client/${clientId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
