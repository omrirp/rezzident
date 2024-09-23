import { create } from 'zustand';
import { Account } from '../models/account';

interface AccountStore {
  account: Account | null;
  setAccount: (account: Account) => void;
  removeAccount: () => void;
}

const useAccountStore = create<AccountStore>((set) => ({
  account: null,
  setAccount: (account: Account) => set({ account }),
  removeAccount: () => set({ account: null }),
}));

export default useAccountStore;
