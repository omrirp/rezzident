import { AxiosError } from 'axios';
import { Lead } from '../models/lead';
import { Deal } from '../models/deal';
import { getExchangeRates } from '../services/others';
import { Account } from '../models/account';

export function isAxiosError(error: any): error is AxiosError {
  return error.isAxiosError;
}

/**
 * This method takes a Date and returns a string of the date
 * in a format of - dd/mm/yy-hh:mm
 * @param date
 */
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year}-${hours}:${minutes}`;
};

/**
 * This function takes a string and returns the same
 * string with upper cased first character
 * @param str: string
 * @returns: string
 */
export const capitalize = (str: string): string => {
  return str[0].toUpperCase() + str.slice(1, str.length);
};

/**
 * This function checks that the input files are images type of PNG or JPG
 * @param files: File[]
 * @returns boolean
 */
export const areValidImages = (files: File[]): boolean => {
  // Supported image MIME types
  const validImageTypes = ['image/jpeg', 'image/png'];

  // Check each file type
  return files.every((file) => validImageTypes.includes(file.type));
};

/**
 * This function calculates the size of the input data in megabytes (MB)
 * @param data: any - The data to calculate the size for (JSON, array, string, number, boolean, etc.)
 * @returns number - The size of the data in megabytes (MB)
 */
export const getSizeInMB = (data: any): number => {
  const jsonString = JSON.stringify(data);
  const sizeInBytes = new Blob([jsonString]).size;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return sizeInMB || 0;
};

interface leadChartMAp {
  [createdAtSum: string]: number;
}

interface leadChartFormat {
  name: string;
  sum: number;
}

/**
 * This function converting the user's leads to a data that fit for a line char.
 * the X axis will be a date format of MM/YYYY
 * and the Y axis will be the number of leads that created at that month.
 * @param leads
 * @returns leadChartFormat[]
 */
export const getLeadsChartData = (leads: Lead[]): leadChartFormat[] => {
  let leadsChartMap: leadChartMAp = {};

  for (let i = 0; i < leads.length; i++) {
    const month = String(leads[i].createdAt.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month index, so add 1
    const year = leads[i].createdAt.getFullYear();
    const mmyyyy = `${month}/${year}`;
    if (leadsChartMap[mmyyyy] == undefined) {
      leadsChartMap[mmyyyy] = 1;
    } else {
      leadsChartMap[mmyyyy]++;
    }
  }

  let leadsChartData: leadChartFormat[] = Object.entries(leadsChartMap).map((entry) => {
    return { name: entry[0], sum: entry[1] };
  });

  const sortedLeadsChartData = leadsChartData.sort((a: leadChartFormat, b: leadChartFormat) => a.name.localeCompare(b.name));

  return sortedLeadsChartData;
};

interface DealMapItem {
  personal: number;
  company: number;
}
interface DealChartMap {
  [dateSum: string]: DealMapItem;
}

export interface DealChartFormat {
  name: string;
  personal: number;
  company: number;
}

/**
 * This function converting the user's leads to a data that fit for a line char.
 * the X axis will be a date format of MM/YYYY
 * and the Y axis will be the profit that made at that month.
 * @param deals
 * @returns leadChartFormat[]
 */
export const getDealsChartData = async (
  deals: Deal[],
  accountId: Account['_id'],
  currency: 'USD' | 'NIS' | 'UER'
): Promise<DealChartFormat[]> => {
  const exchangeRates = await getExchangeRates();
  let dealChartMap: DealChartMap = {};

  // Iterate over the deals array
  for (let i = 0; i < deals.length; i++) {
    // Generate mmyyyy key from the date of the deal
    const month = String(deals[i].date.getMonth() + 1).padStart(2, '0'); // getMonth() returns 0-based month index, so add 1
    const year = deals[i].date.getFullYear();
    const mmyyyy = `${month}/${year}`;

    const convertedFee = deals[i].commissionFee * exchangeRates[deals[i].currency][currency];

    // Check if the key already exists in the map
    if (dealChartMap[mmyyyy]) {
      // If the deal was made by the user, increment personal and company profit
      if (accountId === deals[i].accountId) {
        dealChartMap[mmyyyy].company += convertedFee;
        dealChartMap[mmyyyy].personal += convertedFee;
      }
      // Else, increment only the company profit
      else {
        dealChartMap[mmyyyy].company += convertedFee;
      }
    } else {
      // If the deal was made by the user, set personal and company profit
      if (accountId === deals[i].accountId) {
        dealChartMap[mmyyyy] = { personal: convertedFee, company: convertedFee };
      }
      // Else, set only the company profit and set the private profit to 0
      else {
        dealChartMap[mmyyyy] = { personal: 0, company: convertedFee };
      }
    }
  }

  const profitChardData: DealChartFormat[] = Object.entries(dealChartMap).map((entries) => {
    return {
      name: entries[0],
      personal: entries[1].personal,
      company: entries[1].company,
    };
  });

  return profitChardData;
};

/**
 * This function takes a number and returns it as a string with commas after every 3rd digit
 * @param x - number
 * @returns string of the number with commas
 */
export const toNumberWithCommas = (x: number): string => {
  let numStr: string = x.toString();
  let pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(numStr)) numStr = numStr.replace(pattern, '$1,$2');
  return numStr;
};
