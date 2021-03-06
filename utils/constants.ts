import { ChartBar, DeviceMobile, Key } from 'tabler-icons-react';

export enum ApiEndpoints {
  user = '/api/auth/user',
  election = '/api/election',
}

export enum Constants {
  metamaskLink = 'https://metamask.io/',
  deployedNetwork = 'Ganache Test Network',
  deploymentAddress = '0x33FE38e94029c7C19bF121f05059E8BCb9E35D28',
  projectName = 'E-Voting dApp',
  // This won't cost you any ether.
  signMessage = `
  Hi there from Voting dApp!

  Sign this message to prove you have access to this wallet and we'll sign you up.

  To stop hackers using you wallet, here's a unique messageID they cant't guess:
  `,
  tokenName = 'FINAL_YEAR_TOKEN',
  // ganache account to be used when voting for election
  ganacheAccountNumber = 1,
}

export const Errors = {
  default: 'Something went wrong. Please try again.',
  failedLogin: {
    code: '002',
    message:
      'No account found for the current MetaMask account. Consider signing up.',
  },
  invalidToken:
    'Invalid token found. Please log in to continue to your account.',
  unauthorized: 'Incorrect email or password',
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
