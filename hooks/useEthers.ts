import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';

// technically not a hook
export const initEthers = async () => {
  const ethereum: any = await detectEthereumProvider({
    mustBeMetaMask: true,
  });
  if (ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum, 'any');
    return provider;
  }
  return null;
};
