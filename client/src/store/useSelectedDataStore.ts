import { create } from 'zustand';
import { Asset } from '../models/asset';
import { Lead } from '../models/lead';
import { Agent } from '../models/account';
import { Client } from '../models/client';

interface selectedDataStore {
  selectedAsset: Asset | null;
  setSelectedAsset: (selectedAsset: Asset) => void;
  removeSelectedAsset: () => void;
  selectedLead: Lead | null;
  setSelectedLead: (selectedLead: Lead) => void;
  removeSelectedLead: () => void;
  selectedAgent: Agent | null;
  setSelectedAgent: (selectedAgent: Agent) => void;
  removeSelectedAgent: () => void;
  selectedClient: Client | null;
  setSelectedClient: (selectedClient: Client) => void;
  removeSelectedClient: () => void;
  clearSelectedData: () => void;
}

const useSelectedDataStore = create<selectedDataStore>((set) => ({
  selectedAsset: null,
  setSelectedAsset: (selectedAsset: Asset) => set({ selectedAsset }),
  removeSelectedAsset: () => set({ selectedAsset: null }),
  selectedLead: null,
  setSelectedLead: (selectedLead: Lead) => set({ selectedLead }),
  removeSelectedLead: () => set({ selectedLead: null }),
  selectedAgent: null,
  setSelectedAgent: (selectedAgent: Agent) => set({ selectedAgent }),
  removeSelectedAgent: () => set({ selectedAgent: null }),
  selectedClient: null,
  setSelectedClient: (selectedClient: Client) => set({ selectedClient }),
  removeSelectedClient: () => set({ selectedClient: null }),
  clearSelectedData: () => set({ selectedAsset: null, selectedLead: null, selectedAgent: null, selectedClient: null }),
}));

export default useSelectedDataStore;
