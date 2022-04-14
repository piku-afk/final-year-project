import {
  Box,
  Button,
  Card,
  Center,
  Grid,
  Group,
  Skeleton,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useGlobalStore } from 'context/GlobalStore';
import { useMediaQuery } from 'hooks';
import { withSettingsLayout } from 'layouts';
import { NextPageWithLayout } from 'next';
import Image from 'next/image';
import DigitalCurrency from 'public/images/digital_currency_qpak.svg';
import { useEffect, useState } from 'react';
import { Check, CurrencyEthereum, ExternalLink } from 'tabler-icons-react';
import { ApiEndpoints, Constants } from 'utils/constants';
import { showNotification, NotificationProps } from '@mantine/notifications';
import { MetaMaskHandler } from 'utils/errorHandlers/metamaskHandler';
import { ActionTypes } from 'context/reducer';
import { ethers } from 'ethers';
import axios from 'axios';
import { useSWRConfig } from 'swr';

const MetaMask: NextPageWithLayout = () => {
  const {
    state: { isInitializing, ethersProvider, account },
    dispatch,
  } = useGlobalStore();
  const { mutate } = useSWRConfig();
  const { isExtraSmall, isSmall } = useMediaQuery();
  const [loading, setLoading] = useState(false);
  const [chainId, setChainId] = useState<string>('0x539');
  const isGanacheChain = chainId === '0x539';

  useEffect(() => {
    if (!ethersProvider) return;
    const checkChain = async () => {
      if (!ethersProvider) return;
      const chainId = await ethersProvider.send('eth_chainId', []);
      console.log(chainId);
      setChainId(chainId);
    };

    checkChain();
  }, [ethersProvider]);

  const handleConnect = async () => {
    if (!ethersProvider) return;
    const notificationObject: NotificationProps = {
      message: 'Something went wrong, cannot connect to MetaMask.',
      color: 'red',
    };
    setLoading(true);
    try {
      const accounts = await ethersProvider.send('eth_requestAccounts', []);
      const weiBalance = await ethersProvider.getBalance(accounts[0]);
      const balance = ethers.utils.formatEther(weiBalance);

      dispatch({
        type: ActionTypes.setAccount,
        payload: { number: accounts[0], balance },
      });
      await axios.put('/api/auth/user', { accountAddress: accounts[0] });
      await mutate(ApiEndpoints.user);
      notificationObject.message = 'Connected to MetaMask.';
      notificationObject.color = 'green';
      notificationObject.icon = <Check />;
    } catch (error) {
      notificationObject.message = MetaMaskHandler(error as any);
    }
    setLoading(false);
    showNotification(notificationObject);
  };

  return (
    <Grid gutter={isExtraSmall ? undefined : 'xl'}>
      <Grid.Col lg={5} sm={6}>
        <Card>
          <Text component='h2' style={{ fontSize: 24 }}>
            Connect to MetaMask
          </Text>
          {!ethersProvider ? (
            <>
              {isInitializing ? (
                <Skeleton visible={true} height={16} width='50%' />
              ) : (
                <Text my={'md'}>
                  Please download MetaMask to make your election live.
                </Text>
              )}
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
                  leftIcon: { marginRight: isInitializing ? 0 : '' },
                }}
                component='a'
                href={Constants.metamaskLink}
                target='_blank'
                rel='noopener noreferrer'
                loading={isInitializing}
                leftIcon={!isInitializing && <ExternalLink size={14} />}>
                {!isInitializing && 'Download MetaMask'}
              </Button>
            </>
          ) : !isGanacheChain ? (
            !isInitializing && (
              <>
                <Text color='red'>
                  Online Voting dApp doesn&apos;t support the network with chain
                  ID{' '}
                  <strong>
                    &apos;
                    {chainId}&apos;
                  </strong>
                  . Please change the blockchain network to{' '}
                  <strong>{Constants.deployedNetwork}</strong> through MetaMask.
                </Text>
              </>
            )
          ) : (
            <>
              {account.number ? (
                <Box my={16}>
                  {isSmall && (
                    <Center mt={-8} mb={8}>
                      <Image
                        src={DigitalCurrency.src}
                        alt='Digital Currency'
                        width={200}
                        height={200}
                      />
                    </Center>
                  )}
                  <Text weight={600}>Account Address:</Text>
                  <Text style={{ wordBreak: 'break-word' }}>
                    {account.number}
                  </Text>
                  <Text weight={600} mt={8}>
                    Balance:
                  </Text>
                  <Box className='d-flex align-items-center'>
                    {/* <CurrencyEthereum size={30} strokeWidth={1.3} style={{}} /> */}
                    <Title mt={8} order={3} style={{ fontWeight: 600 }}>
                      {account.balance} ETH
                    </Title>
                  </Box>
                </Box>
              ) : (
                <Text my={16} color='gray'>
                  No account is selected. Please connect to MetaMask and select
                  an account.
                </Text>
              )}
              <Button
                loading={loading}
                color='cyan'
                variant='light'
                onClick={handleConnect}>
                Connect{loading && 'ing'} to MetaMask
              </Button>
              {/* <Button color='red' variant='light' ml={8}>
                Disconnect Wallet
              </Button> */}
              {account.number && (
                <Text mt={8} size='sm' color='gray'>
                  To change the linked account first, change the the current
                  account, in MetaMask, and then press the connect button again.
                </Text>
              )}
            </>
          )}
        </Card>
      </Grid.Col>
      {!isSmall && (
        <Grid.Col lg={7} sm={6}>
          <Center className='h-100'>
            <Image
              src={DigitalCurrency.src}
              width={400}
              height={280}
              alt='profile'
            />
          </Center>
        </Grid.Col>
      )}
    </Grid>
  );
};

MetaMask.getLayout = withSettingsLayout;

export default MetaMask;
