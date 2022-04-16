import { User, Election } from '@prisma/client';
import { ethers } from 'ethers';

export const initialState = {
  account: { number: '', balance: '' },
  currentUser: {
    id: 0,
    name: '',
    email: '',
    organization: '',
    accountAddress: '',
  } as Partial<User>,
  ethersProvider: null as ethers.providers.Web3Provider | null,
  isInitializing: true,
  loading: false,
};

export const electionInitialState = {
  election: {
    id: 0,
    title: '',
    description: '',
    start: null,
    end: null,
    status: 'DRAFT',
  } as Partial<Election>,
};
