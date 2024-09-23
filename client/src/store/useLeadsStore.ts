import { create } from 'zustand';
import { Lead, LogMessage } from '../models/lead';

interface LeadsStore {
  leads: Lead[];
  setLeads: (leads: Lead[]) => void;
  modifyLead: (updatedLead: Lead) => void;
  addLead: (lead: Lead) => void;
  addLogMessageTOLead: (leadId: Lead['_id'], message: LogMessage) => void;
  removeLead: (leadId: Lead['_id']) => void;
  clearLeads: () => void;
}

const useLeadsStore = create<LeadsStore>((set) => ({
  leads: [],
  setLeads: (leads: Lead[]) => set({ leads }),
  modifyLead: (updatedLead: Lead) =>
    set((state) => ({
      leads: state.leads.map((lead) => (lead._id === updatedLead._id ? { ...lead, ...updatedLead } : lead)),
    })),
  addLead: (lead: Lead) => set((state) => ({ leads: [...state.leads, lead] })),
  addLogMessageTOLead: (leadId: Lead['_id'], message: LogMessage) =>
    set((state) => ({ leads: state.leads.map((l) => (l._id === leadId ? { ...l, log: [...l.log, message] } : l)) })),
  removeLead: (leadId: Lead['_id']) => set((state) => ({ leads: state.leads.filter((lead) => lead._id !== leadId) })),
  clearLeads: () => set({ leads: [] }),
}));

export default useLeadsStore;
