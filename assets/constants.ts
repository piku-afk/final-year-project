export enum Constants {
  metamaskLink = 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en',

  deployedNetwork = 'Ganache Test Network',

  // This won't cost you any ether.
  signMessage = `
Hi there from Voting dApp! 
    
Sign this message to prove you have access to this wallet and we'll sign you up. 

To stop hackers using you wallet, here's a unique messageID they cant't guess:
`,
}

export const Errors = {
  failedLogin: {
    code: '002',
    message:
      'No account found for the current MetaMask account. Consider signing up.',
  },
} as const;
