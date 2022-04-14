interface MetaMaskError {
  code: number;
}

export const MetaMaskHandler = (error: MetaMaskError) => {
  console.log(error);
  const { code } = error;
  switch (code) {
    case 4001:
      return 'You will need to connect to MetaMask.';
  }
};
