import { ethers } from 'ethers';

export const initialState = {
  account: '',
  currentUser: { id: 0, name: '', email: '', organization: '' },
  ethersProvider: null as ethers.providers.Web3Provider | null,
  isInitializing: true,
  loading: false,
};
