import { Account } from './account';
import { Client } from './client';
import { Company } from './company';
import { Lead } from './lead';

export interface Asset {
  _id: string;
  assetType: string;
  assetStatus: string; //new, ol
  isExclusive: boolean;
  exclusiveDateExt: Date;
  images: string[];
  floor: number;
  numberOfFloors: number;
  viewType: string; //to city , to sea, to park
  numberOfAirDirection: number; //1,2,3,4
  location: Location['_id'] | Location;
  assetDescription: string;
  dealType: string; //rent//sell
  dealCost: number;
  currency: string; // new property - USA || NIS || EUR
  commissionFee: number;
  availability: 'Available' | 'Occupied';
  bedrooms: number;
  bathrooms: number;
  numberOfParkings: number;
  numberOfBalconies: number;
  amenities: string[];
  assetSquare: number;
  gardenSquare: number;
  dateOfEntry: Date;
  entryType: string; //immediately, flexible
  agents: Account['_id'][];
  clients: Client['_id'][];
  companyId: Company['_id'];
  leads: Lead['_id'][];
  updatedAt: Date;
  createdAt: Date;
}

export interface Location {
  _id: string;
  entry: string; // apartment entry in a building
  city: string;
  street: string;
  houseNumber: string;
  country: string;
}
