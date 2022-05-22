import { Button, Card, Container, Text } from '@mantine/core';
import { useGlobalStore } from 'context/GlobalStore';
import Link from 'next/link';
import { FC, useState } from 'react';
import { Rocket } from 'tabler-icons-react';

interface ConfirmDetailsProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
}

export const Checkout: FC<ConfirmDetailsProps> = (props) => {
  const { nextStep } = props;
  const [loading, setLoading] = useState(false);
  const {
    state: {
      account: { number },
      currentUser: { id },
    },
  } = useGlobalStore();

  const metamaskUrl = `/${id}/settings/metamask`;

  const handleLaunch = () => {
    nextStep();
  };

  return (
    <Card
      component={Container}
      size={number ? 'sm' : 'xs'}
      className='text-center'>
      {number ? (
        <>
          <Text size='xl'>Everything is set!</Text>
          <Text size='xl' mt={8}>
            We are ready to launch your election whenever you are.
          </Text>
          <Button
            loading={loading}
            color='cyan'
            mt={16}
            leftIcon={<Rocket size={18} />}
            onClick={handleLaunch}>
            Launch{loading && 'ing'}
          </Button>
        </>
      ) : (
        <>
          <Text size='xl' mb={8}>
            You have not connected your MetaMask account!
          </Text>
          <Text>
            Your MetaMask account is required to launch the election. Click the
            button below to navigate to the Metamask setting page.
          </Text>
          <Link href={metamaskUrl} passHref>
            <Button mt={24} color='cyan' variant='light'>
              Metamask&apos;s Setting
            </Button>
          </Link>
        </>
      )}
    </Card>
  );
};
