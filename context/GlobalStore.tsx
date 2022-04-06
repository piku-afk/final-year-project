import {
  createContext,
  Dispatch,
  FC,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { initialState, initialStateType } from './initialState';
import { ActionInterface, ActionTypes, reducer } from './reducer';
import { initEthers } from 'hooks/useEthers';

interface GlobalContextType {
  state: initialStateType;
  dispatch: Dispatch<ActionInterface>;
}

const GlobalContext = createContext<GlobalContextType>({
  state: initialState,
  dispatch: () => initialState,
});

export const useGlobalStore = () => useContext(GlobalContext);

export const GlobalStore: FC = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const init = async () => {
      const provider = await initEthers();

      dispatch({ type: ActionTypes.setEthersProvider, payload: provider });
      dispatch({ type: ActionTypes.setIsInitializing, payload: false });
    };
    init();
  }, []);

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
