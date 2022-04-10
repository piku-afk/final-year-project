import { Constants } from 'utils/constants';

export const getSignMessage = (nonce: string) => {
  return `${Constants.signMessage}
${nonce}
  `;
};
