import axios from 'axios';
import { Account, Agent } from '../models/account';
import { Company } from '../models/company';

export const createAgentAccount = async (
  agent: Omit<Account, '_id' | 'isLocked' | 'avatar' | 'token' | 'createdAt' | 'plan'>,
  password: string,
  token: Account['token']
): Promise<Agent> => {
  const res = await axios.post<Agent>(
    'http://localhost:3001/api/agents/newagent',
    { agent, password },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

export const getAgents = async (companyId: Company['_id'], accountId: Account['_id'], token: Account['token']): Promise<Agent[]> => {
  const res = await axios.get<Agent[]>(`http://localhost:3001/api/agents/agents/${companyId}/${accountId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateLockStatus = async (agentId: Agent['_id'], lock: boolean, token: Account['token']): Promise<string> => {
  const res = await axios.post<string>(
    'http://localhost:3001/api/agents/lock',
    { agentId, lock },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};
