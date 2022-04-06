import { NextPage } from 'next';
import { Button, Text } from '@mantine/core';
import Head from 'next/head';
import { ExternalLink, Check } from 'tabler-icons-react';
import { v5 } from 'uuid';

import { useGlobalStore } from 'context/GlobalStore';
import VotingSVG from 'public/images/voting_nvu7.svg';
import { Constants } from 'assets/constants';
import { useCallback, useState } from 'react';
import { ActionTypes } from 'context/reducer';
import { NotificationProps, showNotification } from '@mantine/notifications';
import Link from 'next/link';
import { LoginLayout } from 'layouts/login';

const Login: NextPage = () => {
  const { state, dispatch } = useGlobalStore();
  const { ethersProvider } = state;
  const [loading, setLoading] = useState(false);

  const handleConnect = useCallback(async () => {
    if (!ethersProvider) return;
    setLoading(true);
    const notificationObject: NotificationProps = {
      message: 'You are successfully logged in.',
      color: 'red',
      autoClose: 3500,
      icon: null,
    };
    try {
      const accounts = await ethersProvider.send('eth_requestAccounts', []);

      dispatch({ type: ActionTypes.setAccount, payload: accounts[0] });
      notificationObject.color = 'green';
      notificationObject.icon = <Check size={20} />;
    } catch (error) {
      const { code } = error as { code: number };
      notificationObject.message = 'Something went wrong. Please try again.';

      if (code === 4001) {
        notificationObject.message =
          'You will need to connect to MetaMask in order to continue.';
      }
    }
    setLoading(false);
    showNotification(notificationObject);
  }, [ethersProvider, dispatch]);

  return (
    <LoginLayout>
      <Head>
        <title>Welcome</title>
      </Head>
      <Text className='my-3'>Login back into your account.</Text>

      <Button loading={loading} variant='light' onClick={handleConnect}>
        Log{loading ? 'ing' : 'in'} with MetaMask
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
