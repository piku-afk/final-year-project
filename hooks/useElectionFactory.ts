import { useGlobalStore } from 'context/GlobalStore';
import { ethers } from 'ethers';
import ElectionJSON from '../server/truffle/build/contracts/Election.json';

export const useElectionFactory = () => {
  const {
    state: { ethersProvider },
  } = useGlobalStore();

  if (!ethersProvider) return null;

  const signer = ethersProvider.getSigner();
  return ethers.ContractFactory.fromSolidity(ElectionJSON, signer);
};
