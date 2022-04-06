import { Constants } from 'assets/constants';

export const getSignMessage = (nonce: string) => {
  return `${Constants.signMessage}
${nonce}
  `;
};
