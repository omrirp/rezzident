import axios from 'axios';
import { Asset, Location } from '../models/asset';
import { Account } from '../models/account';
import { Deal } from '../models/deal';
import { Company } from '../models/company';

export const createAsset = async (
  asset: Omit<Asset, '_id' | 'location' | 'updatedAt' | 'createdAt' | 'availability' | 'clients' | 'leads'>,
  location: Omit<Location, '_id'>,
  accountId: Account['_id'],
  token: string
): Promise<Asset> => {
  const res = await axios.post<Asset>(
    'http://localhost:3001/api/assets/newasset',
    { asset, location, accountId },
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // Convert date strings to Date objects
  const convertedAsset: Asset = {
    ...res.data,
    dateOfEntry: res.data.dateOfEntry ? new Date(res.data.dateOfEntry) : null,
    exclusiveDateExt: res.data.exclusiveDateExt ? new Date(res.data.exclusiveDateExt) : null,
  } as Asset;

  return convertedAsset;
};

export const getMyAssets = async (CompanyId: Company['_id'], token: string): Promise<Asset[]> => {
  const res = await axios.get<Asset[]>(`http://localhost:3001/api/assets/assets/${CompanyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Convert date strings to Date objects
  const convertedAssets: Asset[] = res.data.map((asset) => ({
    ...asset,
    dateOfEntry: asset.dateOfEntry ? new Date(asset.dateOfEntry) : null,
    exclusiveDateExt: asset.exclusiveDateExt ? new Date(asset.exclusiveDateExt) : null,
    createdAt: asset.createdAt ? new Date(asset.createdAt) : null,
    updatedAt: asset.updatedAt ? new Date(asset.updatedAt) : null,
    // Convert any other date fields similarly if needed...
  })) as Asset[];

  return convertedAssets;
};

export const updateAsset = async (
  asset: Omit<Asset, 'location' | 'updatedAt' | 'createdAt'>,
  location: Omit<Location, '_id'>,
  token: string
): Promise<Asset> => {
  const res = await axios.put<Asset>(
    'http://localhost:3001/api/assets/asset',
    { asset, location },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const modifiedAsset: Asset = res.data;

  // Convert date strings to Date objects
  const convertedAsset: Asset = {
    ...modifiedAsset,
    dateOfEntry: modifiedAsset.dateOfEntry ? new Date(modifiedAsset.dateOfEntry) : null,
    exclusiveDateExt: modifiedAsset.exclusiveDateExt ? new Date(modifiedAsset.exclusiveDateExt) : null,
  } as Asset;

  return convertedAsset;
};

export const deleteAsset = async (assetId: Asset['_id'], token: Account['token']): Promise<Asset['_id']> => {
  const result = await axios.delete<Asset['_id']>(`http://localhost:3001/api/assets/asset/${assetId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return result.data;
};

export const closeDeal = async (assetId: Asset['_id'], deal: Omit<Deal, 'date'>, token: Account['_id']): Promise<Deal> => {
  const res = await axios.post<Deal>(
    'http://localhost:3001/api/assets/deal',
    { assetId, deal },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};
