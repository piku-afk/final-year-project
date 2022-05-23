import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { initialState } from './initialState';
import { ActionInterface, ActionTypes, reducer } from './reducer';
import { initEthers } from 'hooks/useEthers';
import useSWR from 'swr';
import { useUser } from 'hooks/fetchers';

interface GlobalContextType {
  state: typeof initialState;
  dispatch: Dispatch<ActionInterface>;
}

const GlobalContext = createContext<GlobalContextType>({
  state: initialState,
  dispatch: () => initialState,
});

export const useGlobalStore = () => useContext(GlobalContext);

export const GlobalStore: FC<PropsWithChildren<{}>> = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, isValidating } = useSWR('/api/auth/user', useUser);

  useEffect(() => {
    const init = async () => {
      const provider = await initEthers();
      if (!isValidating && data !== undefined) {
        const { email, id, name, organization } = data;
        dispatch({
          type: ActionTypes.setCurrentUser,
          payload: { email, id, name, organization: organization || '' },
        });
      }

      dispatch({ type: ActionTypes.setEthersProvider, payload: provider });
      dispatch({ type: ActionTypes.setIsInitializing, payload: false });
    };
    init();
  }, [data, isValidating]);

  const { ethersProvider } = state;
  useEffect(() => {
    if (!ethersProvider) return;
    const handleChainChange = (newNetwork: any, oldNetwork: any) => {
      console.log('network changed');
      if (oldNetwork) {
        window.location.reload();
      }
    };
    ethersProvider.on('network', handleChainChange);

    return () => {
      ethersProvider.off('network', handleChainChange);
    };
  }, [ethersProvider]);

  const value = { state, dispatch };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
};
