import { Button, Text } from '@mantine/core';
import { showNotification, NotificationProps } from '@mantine/notifications';
import { useGlobalStore } from 'context/GlobalStore';
import { LoginLayout } from 'layouts/login';
import { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { Check } from 'tabler-icons-react';

const signMessage = `
Hi there from Voting dApp! 

Sign this message to prove you have access to this wallet and we'll sign you up. This won't cost you any ether.

To stop hackers using you wallet, here's a unique messageID they cant't guess:
`;

const SignUp: NextPage = () => {
  const { state, dispatch } = useGlobalStore();
  const { ethersProvider } = state;
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!ethersProvider) return;
    setLoading(true);
    const notificationObject: NotificationProps = {
      message: 'You are successfully logged in.',
      color: 'red',
      autoClose: 3500,
      icon: null,
    };
    try {
      await ethersProvider.send('eth_requestAccounts', []);
      const signer = ethersProvider.getSigner();
      const signature = await signer.signMessage(signMessage);
      console.log(signature);

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
  };

  return (
    <LoginLayout>
      <Text className='my-3'>
        Get started by connecting your MetaMask wallet.
      </Text>
      <Button loading={loading} variant='light' onClick={handleSignUp}>
        Sign{loading ? 'ing up' : 'up'} with MetaMask
      </Button>
      <Text size='sm' mt={8}>
        Already a user ?&nbsp;
        <Link href='/login' passHref>
          <Text
            style={{ fontWeight: 600 }}
            inherit
            component='a'
            variant='link'
            color='blue'>
            Log in
          </Text>
        </Link>
      </Text>
    </LoginLayout>
  );
};

export default SignUp;
