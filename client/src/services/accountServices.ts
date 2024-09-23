import axios from 'axios';
import { Account } from '../models/account';

interface AccountData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

interface LogInResponse {
  account: Account;
  token: string;
}

export const createAccount = async (data: AccountData): Promise<Account> => {
  const res = await axios.post<LogInResponse>('http://localhost:3001/api/account/newaccount', data);
  if (res.status === 200) {
    res.data.account.token = res.data.token;
    return res.data.account;
  }
  throw new Error('Cannot create an account, Email may already exist');
};

export const findByCredentials = async (email: string, password: string): Promise<Account> => {
  const res = await axios.post<LogInResponse>('http://localhost:3001/api/account/login', { email, password });
  if (res.status === 200) {
    res.data.account.token = res.data.token;
    return res.data.account;
  }
  throw new Error('Invalid Email or Password');
};

export const updateAccount = async (account: Account, token: Account['token']): Promise<Account> => {
  const res = await axios.put<Account>('http://localhost:3001/api/account/update', account, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (res.status === 202) {
    return res.data;
  }
  throw new Error('Something went wrong while updating account details');
};

export const changePlan = async (
  _id: Account['_id'],
  plan: 'Basic' | 'Premium' | 'Platinum',
  token: Account['token']
): Promise<Account> => {
  const res = await axios.put<Account>(
    'http://localhost:3001/api/account/updateplan',
    { _id, plan },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (res.status === 202) {
    return res.data;
  }
  throw new Error('Something went wrong while trying to upgrade your plan to Premium');
};
