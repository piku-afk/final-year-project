import { ChartBar, DeviceMobile, Key } from 'tabler-icons-react';

export enum Constants {
  metamaskLink = 'https://metamask.io/',

  deployedNetwork = 'Ganache Test Network',

  projectName = 'E-Voting dApp',

  // This won't cost you any ether.
  signMessage = `
  Hi there from Voting dApp!

  Sign this message to prove you have access to this wallet and we'll sign you up.

  To stop hackers using you wallet, here's a unique messageID they cant't guess:
  `,

  tokenName = 'FINAL_YEAR_TOKEN',
}

export const Errors = {
  failedLogin: {
    code: '002',
    message:
      'No account found for the current MetaMask account. Consider signing up.',
  },
} as const;

export const AppFeatures = [
  {
    title: 'Secure Voting',
    description:
      'Each voter has a unique "Voter ID" and "Voter Key" and can only vote once.',
    // icon: <Key size={48} strokeWidth={2} />,
    Icon: Key,
  },
  {
    title: 'Mobile Ready',
    description:
      'Elections are optimized for desktop and mobile devices. Voters can vote from a desktop, tablet or mobile using a web browser.',
    Icon: DeviceMobile,
  },
  {
    title: 'Results Tabulation',
    description:
      'Election results are automatically calculated and presented with beautiful charts.',
    Icon: ChartBar,
  },
] as const;
