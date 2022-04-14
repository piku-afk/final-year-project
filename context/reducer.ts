import { ethers } from 'ethers';
import { initialState } from './initialState';

type initialStateType = typeof initialState;

export enum ActionTypes {
  setAccount = 'SET_ACCOUNT',
  setCurrentUser = 'SET_CURRENT_USER',
  setEthersProvider = 'SET_ETHERS_PROVIDER',
  setIsInitializing = 'SET_IS_INITIALIZING',
  setLoading = 'SET_LOADING',
}

export type ActionInterface =
  | {
      type: ActionTypes.setAccount;
      payload: { number: string; balance: string };
    }
  | {
      type: ActionTypes.setCurrentUser;
      payload: typeof initialState.currentUser;
    }
  | {
      type: ActionTypes.setEthersProvider;
      payload: ethers.providers.Web3Provider | null;
    }
  | {
      type: ActionTypes.setIsInitializing;
      payload: boolean;
    }
  | {
      type: ActionTypes.setLoading;
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

    case ActionTypes.setCurrentUser:
      return { ...state, currentUser: action.payload };

    case ActionTypes.setEthersProvider:
      return { ...state, ethersProvider: action.payload };

    case ActionTypes.setIsInitializing:
      return { ...state, isInitializing: action.payload };

    case ActionTypes.setLoading:
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};
