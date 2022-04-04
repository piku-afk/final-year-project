import { ethers } from 'ethers';
import { initialStateType } from './initialState';

export enum ActionTypes {
  setIsInitializing = 'SET_IS_INITIALIZING',
  setAccount = 'SET_ACCOUNT',
  setEthersProvider = 'SET_ETHERS_PROVIDER',
}

export type ActionInterface =
  | {
      type: ActionTypes.setAccount;
      payload: string;
    }
  | {
      type: ActionTypes.setEthersProvider;
      payload: ethers.providers.Web3Provider | null;
    }
  | {
      type: ActionTypes.setIsInitializing;
      payload: boolean;
    };

export const reducer = (
  state: initialStateType,
  action: ActionInterface
): initialStateType => {
  const { type } = action;
  switch (type) {
    case ActionTypes.setAccount:
      return { ...state, account: action.payload };
    case ActionTypes.setEthersProvider:
      return { ...state, ethersProvider: action.payload };
    case ActionTypes.setIsInitializing:
      return { ...state, isInitializing: action.payload };
    default:
      return state;
  }
};
