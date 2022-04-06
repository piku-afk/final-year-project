import {
  Box,
  Button,
  Card,
  Center,
  Container,
  Image,
  MediaQuery,
  Skeleton,
  Text,
  Title,
} from '@mantine/core';
import { FC, useCallback, useEffect, useState } from 'react';
import VotingSVG from 'public/images/voting_nvu7.svg';
import { useGlobalStore } from 'context/GlobalStore';
import { Constants } from 'assets/constants';
import { ExternalLink } from 'tabler-icons-react';
import { useRouter } from 'next/router';

interface LoginLayoutPropTypes {
  image: { src: string };
}

export const LoginLayout: FC<LoginLayoutPropTypes> = (props) => {
  const { children, image } = props;
  const { state } = useGlobalStore();
  const { isInitializing, ethersProvider } = state;
  const [chainId, setChainId] = useState<string | null>(null);
  const { pathname } = useRouter();
  const isLogin = pathname === '/login';

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

  const isGanacheChain = chainId === '0x539';

  return (
    <Container style={{ height: '100vh' }} fluid>
      <Center style={{ height: '100%', textAlign: 'center' }}>
        <Card style={{ maxWidth: 375 }} withBorder shadow='md' px='xl' py={32}>
          {!isLogin && <Text align='center'>Hi there, welcome to</Text>}
          <Title order={3} my={3}>
            Electronic Voting System
          </Title>
          <Title order={6} sx={(theme) => ({ color: theme.colors.gray[6] })}>
            A ethereum blockchain based dApp
          </Title>
          <Box
            style={{
              width: 200,
              margin: `${isLogin ? 40 : 30}px auto`,
            }}>
            <Image src={image.src || VotingSVG.src} alt='Voting Image' />
          </Box>
          {!ethersProvider ? (
            <>
              <Text my={'md'}>
                {isInitializing ? (
                  <Skeleton visible={isInitializing} height={16} />
                ) : (
                  <>Please download and install MetaMask to use this app</>
                )}
              </Text>
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
            children
          )}
        </Card>
      </Center>
    </Container>
  );
};
