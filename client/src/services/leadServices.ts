import axios from 'axios';
import { Account } from '../models/account';
import { Lead } from '../models/lead';

export const createLead = async (lead: Omit<Lead, '_id' | 'createdAt' | 'updatedAt' | 'log'>, toke: Account['token']): Promise<Lead> => {
  const result = await axios.post<Lead>('http://localhost:3001/api/leads/lead', lead, {
    headers: { Authorization: `Bearer ${toke}` },
  });

  const convertedLead: Lead = {
    ...result.data,
    createdAt: new Date(result.data.createdAt),
    updatedAt: new Date(result.data.updatedAt),
  };

  return convertedLead;
};

export const getMyLeads = async (accountId: Account['_id'], token: Account['token']): Promise<Lead[]> => {
  const results = await axios.get<Lead[]>(`http://localhost:3001/api/leads/leads/${accountId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const convertedLeads: Lead[] = results.data.map((lead) => ({
    ...lead,
    createdAt: new Date(lead.createdAt),
    updatedAt: new Date(lead.updatedAt),
  }));

  return convertedLeads;
};

export const updateLead = async (lead: Omit<Lead, 'createdAt' | 'updatedAt'>, token: Account['token']): Promise<Lead> => {
  const result = await axios.put<Lead>('http://localhost:3001/api/leads/lead', lead, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const convertedLead: Lead = {
    ...result.data,
    createdAt: new Date(result.data.createdAt),
    updatedAt: new Date(result.data.updatedAt),
  };

  return convertedLead;
};

export const addMEssageTOLog = async (leadId: Lead['_id'], logMessage: string, token: Account['token']): Promise<Lead> => {
  const result = await axios.put<Lead>(
    'http://localhost:3001/api/leads/addtolog',
    { leadId, logMessage },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  const convertedLead: Lead = {
    ...result.data,
    createdAt: new Date(result.data.createdAt),
    updatedAt: new Date(result.data.updatedAt),
  };

  return convertedLead;
};

export const deleteLead = async (id: Lead['_id'], token: Account['token']): Promise<Lead['_id']> => {
  const result = await axios.delete<Lead['_id']>(`http://localhost:3001/api/leads/lead/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return result.data;
};
