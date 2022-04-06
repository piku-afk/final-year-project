import { Contract, ethers } from 'ethers';
import { useGlobalStore } from 'context/GlobalStore';
import AccountJSON from 'backend/build/contracts/Account.json';
import { useCallback, useEffect, useState } from 'react';

export const useAccountContract = (authContract: Contract | null) => {
  const { state } = useGlobalStore();
  const { ethersProvider } = state;
  const [accountContract, setAccountContract] = useState<Contract | null>(null);

  const init = useCallback(async () => {
    if (!ethersProvider || !authContract) return null;
    console.log('init');

    const signer = ethersProvider.getSigner();
    const address = await authContract.getAccountAddress();
    const accountContract = new ethers.Contract(
      address,
      AccountJSON.abi,
      signer
    );
    setAccountContract(accountContract);
  }, [authContract, ethersProvider]);

  useEffect(() => {
    init();
  }, [init]);

  return accountContract;
};
