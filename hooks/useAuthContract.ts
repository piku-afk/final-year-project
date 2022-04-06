import { Contract, ethers } from 'ethers';
import { useGlobalStore } from 'context/GlobalStore';
import AuthJSON from 'backend/build/contracts/Auth.json';
import { useCallback, useEffect, useState } from 'react';

export const useAuthContract = () => {
  const { state } = useGlobalStore();
  const { ethersProvider } = state;
  const [authContract, setAuthContract] = useState<Contract | null>(null);

  const init = useCallback(async () => {
    if (!ethersProvider) return;

    const signer = ethersProvider.getSigner();
    const authContract = new ethers.Contract(
      AuthJSON.networks[5777].address,
      AuthJSON.abi,
      signer
    );
    setAuthContract(authContract);
  }, [ethersProvider]);

  useEffect(() => {
    init();
  }, [init]);

  return authContract;
};
