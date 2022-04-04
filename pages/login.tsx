import { NextPage } from 'next';
import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Image,
  Text,
  Title,
} from '@mantine/core';
import Head from 'next/head';
import { ExternalLink, Check } from 'tabler-icons-react';

import { useGlobalStore } from 'context/GlobalStore';
import VotingSVG from 'public/images/voting_nvu7.svg';
import { Constants } from 'assets/images/constants';
import { useCallback, useState } from 'react';
import { ActionTypes } from 'context/reducer';
import { NotificationProps, showNotification } from '@mantine/notifications';
import Link from 'next/link';

const Login: NextPage = () => {
  const { state, dispatch } = useGlobalStore();
  const { isInitializing, ethersProvider } = state;
  const [loading, setLoading] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);

  const welcomeText = ethersProvider
    ? 'Get started by connecting your MetaMask wallet.'
    : 'Please download and install MetaMask to use this app';

  console.log(chainId);

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
      const chainId = await ethersProvider.send('eth_chainId', []);

      setChainId(chainId);
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
    <Container style={{ height: '100vh' }} fluid>
      <Head>
        <title>Welcome</title>
      </Head>
      <Center style={{ height: '100%', textAlign: 'center' }}>
        <Card style={{ maxWidth: 400 }} withBorder shadow='xs' px='xl' py={32}>
          <Text align='center'>Hi there,</Text>
          <Title order={3} mt={0}>
            Welcome to Online Voting dApp
          </Title>
          <Box
            style={{
              width: 200,
              margin: '40px auto',
            }}>
            <Image src={VotingSVG.src} alt='Voting Image' />
          </Box>
          <Text className='my-3'>{welcomeText}</Text>
          {ethersProvider ? (
            <>
              <Button loading={loading} variant='light' onClick={handleConnect}>
                Connect{loading && 'ing'} to MetaMask
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
            </>
          ) : (
            <Button
              variant='gradient'
              styles={{
                root: {
                  background: '#f6851b',
                  '&:hover': {
                    color: 'white',
                  },
                  '&:focus,&:focus-visible': {
                    outlineColor: '#ffda7e',
                  },
                },
                leftIcon: { marginRight: 0 },
              }}
              component='a'
              href={Constants.metamaskLink}
              target='_blank'
              rel='noopener noreferrer'
              loading={isInitializing}
              leftIcon={!isInitializing && <ExternalLink size={14} />}>
              {!isInitializing && 'Download MetaMask'}
            </Button>
          )}
        </Card>
      </Center>
    </Container>
  );
};

export default Login;
