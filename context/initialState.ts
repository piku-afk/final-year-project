import { ethers } from 'ethers';

let temp: ethers.providers.Web3Provider;

export const initialState = {
  isInitializing: true,
  account: '',
  ethersProvider: null as ethers.providers.Web3Provider | null,
};

export type initialStateType = typeof initialState;
