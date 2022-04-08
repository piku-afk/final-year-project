import { Button, Text } from '@mantine/core';
import { showNotification, NotificationProps } from '@mantine/notifications';
import { getSignMessage } from 'assets/helpers/getSignMessage';
import { handleLoginError } from 'assets/helpers/handleErrors';
import { useGlobalStore } from 'context/GlobalStore';
import { useAuthContract } from 'hooks/useAuthContract';
import { LoginLayout } from 'layouts/login';
import { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import { Check } from 'tabler-icons-react';
import WelcomeSVG from 'public/images/welcoming_re_x0qo.svg';
import Head from 'next/head';

const SignUp: NextPage = () => {
  const { state, dispatch } = useGlobalStore();
  const { ethersProvider } = state;
  const [loading, setLoading] = useState(false);
  const authContract = useAuthContract();

  const handleSignUp = async () => {
    if (!ethersProvider) return;
    if (!authContract) return;
    setLoading(true);
    const notificationObject: NotificationProps = {
      message: 'You are successfully logged in.',
      color: 'red',
      icon: null,
    };
    try {
      await ethersProvider.send('eth_requestAccounts', []);
      const signer = ethersProvider.getSigner();
      const nonce = 'some-unique-codesome-unique-code';
      const signMessage = getSignMessage(nonce);
      const signature = await signer.signMessage(signMessage);
      console.log(signature);
      await authContract.signUp(Buffer.from(nonce), 'Piyush');

      notificationObject.color = 'green';
      notificationObject.icon = <Check size={20} />;
    } catch (error) {
      handleLoginError(error, notificationObject);
    }
    setLoading(false);
    showNotification(notificationObject);
  };

  return (
    <LoginLayout image={WelcomeSVG}>
      <Head>
        <title>Register | Voting dApp</title>
      </Head>
      <Text my={16}>Get started by connecting your MetaMask wallet.</Text>
      <Button loading={loading} variant='light' onClick={handleSignUp}>
        Sign{loading ? 'ing up' : ' up'} with MetaMask
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
