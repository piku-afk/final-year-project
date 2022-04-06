import { ethers } from 'ethers';

export const initialState = {
  isInitializing: true,
  account: '',
  ethersProvider: null as ethers.providers.Web3Provider | null,
};

export type initialStateType = typeof initialState;
