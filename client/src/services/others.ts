export type ExchangeRates = {
  [currency: string]: {
    [targetCurrency: string]: number;
  };
};

const dummyExchange: ExchangeRates = {
  USD: { NIS: 3.76, EUR: 0.92, USD: 1 },
  EUR: { NIS: 4.07, USD: 1.08, EUR: 1 },
  NIS: { USD: 0.27, EUR: 0.25, NIS: 1 },
};

export const getCurrencyExchange = async (base: string, target: string): Promise<number> => {
  // Dummy exchange rate API
  return new Promise((resolve, reject) => {
    try {
      if (dummyExchange[base] && dummyExchange[base][target] !== undefined) {
        resolve(dummyExchange[base][target]);
      } else {
        reject(new Error(`Exchange rate not found for base: ${base} and target: ${target}`));
      }
    } catch (error) {
      reject(new Error(`An error occurred while fetching the exchange rate`));
    }
  });
};

export const getExchangeRates = async (): Promise<ExchangeRates> => {
  return new Promise((resolve, _) => {
    resolve(dummyExchange);
  });
};
