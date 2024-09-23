import { create } from 'zustand';
import { Company } from '../models/company';
import { Location } from '../models/asset';
import { Agent } from '../models/account';
import { Deal } from '../models/deal';
import { Client } from '../models/client';

interface CompanyStore {
  company: Company | null;
  location: Location | null;
  agents: Agent[] | [];
  deals: Deal[] | [];
  clients: Client[];
  setCompany: (company: Company) => void;
  setLocation: (location: Location) => void;
  setAgents: (agents: Agent[]) => void;
  updateAgentLock: (agentId: Agent['_id'], lockStatus: boolean) => void;
  setDeals: (deals: Deal[]) => void;
  setClients: (clients: Client[]) => void;
  updateClient: (clientData: Client) => void;
  removeClient: (clientId: Client['_id']) => void;
  clearCompany: () => void;
}

const useCompanyStore = create<CompanyStore>((set) => ({
  company: null,
  location: null,
  agents: [],
  deals: [],
  clients: [],
  setCompany: (company: Company) => set((state) => ({ ...state, company })),
  setLocation: (location: Location) => set((state) => ({ ...state, location })),
  setAgents: (agents: Agent[]) => set((state) => ({ ...state, agents })),
  updateAgentLock: (agentId: Agent['_id'], lockStatus: boolean) =>
    set((state) => ({
      ...state, // Spread the entire state to retain other properties like `company` and `location`
      agents: state.agents.map((agent) => (agent._id === agentId ? { ...agent, isLocked: lockStatus } : agent)),
    })),
  setDeals: (deals: Deal[]) => set((state) => ({ ...state, deals })),
  setClients: (clients: Client[]) => set((state) => ({ ...state, clients })),
  updateClient: (clientData: Client) =>
    set((state) => ({
      ...state,
      clients: state.clients.map((client) => (client._id === clientData._id ? clientData : client)),
    })),
  removeClient: (clientId: Client['_id']) => set((state) => ({ clients: state.clients.filter((client) => client._id !== clientId) })),
  clearCompany: () => set({ company: null, location: null, agents: [], deals: [], clients: [] }),
}));

export default useCompanyStore;
