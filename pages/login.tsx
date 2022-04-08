import { NextPage } from 'next';
import { Button, Text } from '@mantine/core';
import Head from 'next/head';
import { Check } from 'tabler-icons-react';

import { useGlobalStore } from 'context/GlobalStore';
import { useCallback, useState } from 'react';
import { ActionTypes } from 'context/reducer';
import { NotificationProps, showNotification } from '@mantine/notifications';
import Link from 'next/link';
import { LoginLayout } from 'layouts/login';
import { getSignMessage } from 'assets/helpers/getSignMessage';
import { useAuthContract } from 'hooks/useAuthContract';
import { useAccountContract } from 'hooks/useAccountContract';
import { ethers } from 'ethers';
import { useRouter } from 'next/router';
import { handleLoginError } from 'assets/helpers/handleErrors';
import { Errors } from 'assets/constants';
import SecureLogin from 'public/images/secure_files_re_6vdh.svg';

const Login: NextPage = () => {
  const { push } = useRouter();
  const authContract = useAuthContract();
  const { state, dispatch } = useGlobalStore();
  const accountContract = useAccountContract(authContract);
  const [loading, setLoading] = useState(false);
  const { ethersProvider } = state;

  const handleConnect = useCallback(async () => {
    if (!ethersProvider) return;
    if (!authContract) return;
    if (!accountContract) return;
    setLoading(true);
    const notificationObject: NotificationProps = {
      message: 'You are successfully logged in.',
      color: 'red',
      icon: null,
    };
    try {
      const accounts = await ethersProvider.send('eth_requestAccounts', []);
      // Step 1: Get nonce from backend
      const nonceHash = await accountContract.getNonce();
      const nonce = ethers.utils.toUtf8String(nonceHash);

      // Step 2: Sign message using the nonce fetched above
      const signMessage = getSignMessage(nonce);
      const signer = ethersProvider.getSigner();
      const signature = await signer.signMessage(signMessage);
      const r = signature.slice(0, 66);
      const s = `0x${signature.slice(66, 130)}`;
      const v = Number('0x' + signature.slice(130, 132)) || 27;

      // Step 3: verify address
      const prefix = Buffer.from('\x19Ethereum Signed Message:\n');
      const hashForVerification = ethers.utils.keccak256(
        Buffer.concat([
          prefix,
          Buffer.from(String(Buffer.from(signMessage).length)),
          Buffer.from(signMessage),
        ])
      );
      const result = await accountContract.verify(hashForVerification, v, r, s);
      // show error when validation result is false
      // if (!result) throw new Error('Wrong Account');
      if (!result) throw Errors.failedLogin;

      // navigate to homepage when validation result is true
      dispatch({ type: ActionTypes.setAccount, payload: accounts[0] });
      notificationObject.icon = <Check size={20} />;
      notificationObject.color = 'green';
      push('/');
    } catch (error) {
      handleLoginError(error, notificationObject);
    }
    setLoading(false);
    showNotification(notificationObject);
  }, [ethersProvider, dispatch, authContract, accountContract, push]);

  return (
    <LoginLayout image={SecureLogin}>
      <Head>
        <title>Login | Voting dApp</title>
      </Head>
      <Text my={16}>Welcome back, login to continue to your account.</Text>

      <Button loading={loading} variant='light' onClick={handleConnect}>
        Log{loading ? 'ing' : ' in'} with MetaMask
      </Button>
      <Text size='sm' mt={8}>
        Do not have an account ?&nbsp;
        <Link href='/signup' passHref>
          <Text
            style={{ fontWeight: 600 }}
            inherit
            component='a'
            variant='link'
            color='blue'>
            Sign up
          </Text>
        </Link>
      </Text>
    </LoginLayout>
  );
};

export default Login;
