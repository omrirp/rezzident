import { create } from 'zustand';
import { Asset } from '../models/asset';

interface AssetsStore {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Asset) => void;
  modifyAsset: (_id: string, asset: Asset) => void;
  removeAsset: (assetId: Asset['_id']) => void;
  localCloseADeal: (assetId: Asset['_id']) => void;
  clearAssets: () => void;
}

const useAssetsStore = create<AssetsStore>((set) => ({
  assets: [],
  setAssets: (assets: Asset[]) => set({ assets }),
  addAsset: (asset: Asset) => set((state) => ({ assets: [...state.assets, asset] })),
  modifyAsset: (_id: string, asset: Asset) =>
    set((state) => ({
      assets: state.assets.map((a) => (a._id === _id ? asset : a)),
    })),
  removeAsset: (assetId: Asset['_id']) => set((state) => ({ assets: state.assets.filter((asset) => asset._id !== assetId) })),
  localCloseADeal: (assetId: Asset['_id']) =>
    set((state) => ({ assets: state.assets.map((asset) => (asset._id === assetId ? { ...asset, availability: 'Occupied' } : asset)) })),
  clearAssets: () => set({ assets: [] }),
}));

export default useAssetsStore;
