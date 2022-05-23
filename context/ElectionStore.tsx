import { getElection } from 'hooks/fetchers';
import { useRouter } from 'next/router';
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import useSWR from 'swr';
import { ApiEndpoints } from 'utils/constants';
import { ElectionActionTypes, electionReducer } from './electionReducer';
import { electionInitialState } from './initialState';

interface ElectionContextType {
  state: typeof electionInitialState;
  dispatch: any;
  isInitializing: boolean;
}

const ElectionContext = createContext<ElectionContextType>({
  state: electionInitialState,
  dispatch: () => electionInitialState,
  isInitializing: true,
});

export const useElectionStore = () => useContext(ElectionContext);

export const ElectionStore: FC<PropsWithChildren<{}>> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(electionReducer, electionInitialState);
  const [isInitializing, setIsInitializing] = useState(true);
  const {
    query: { electionId },
  } = useRouter();
  const { data, isValidating } = useSWR(
    `${ApiEndpoints.election}/${electionId}`,
    getElection
  );

  useEffect(() => {
    const init = () => {
      setIsInitializing(true);
      if (isValidating) return;
      setIsInitializing(false);

      if (data) {
        dispatch({ type: ElectionActionTypes.setElection, payload: data });
      }
    };
    init();
  }, [data, isValidating]);

  const value = { state, dispatch, isInitializing };

  return (
    <ElectionContext.Provider value={value}>
      {children}
    </ElectionContext.Provider>
  );
};
