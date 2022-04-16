import { Election } from '@prisma/client';
import { electionInitialState } from './initialState';

type initialStateType = typeof electionInitialState;

export enum ElectionActionTypes {
  setElection = 'SET_ELECTION',
}

export type ElectionActionInterface = {
  type: ElectionActionTypes.setElection;
  payload: Partial<Election>;
};

export const electionReducer = (
  state: initialStateType,
  action: ElectionActionInterface
): initialStateType => {
  const { type } = action;
  switch (type) {
    case ElectionActionTypes.setElection:
      return { ...state, election: { ...state.election, ...action.payload } };

    default:
      return state;
  }
};
