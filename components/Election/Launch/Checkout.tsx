import { Button, Card, Container, Text } from '@mantine/core';
import { useGlobalStore } from 'context/GlobalStore';
import { BigNumber, ethers } from 'ethers';
import Link from 'next/link';
import { FC, useState } from 'react';
import { Check, Rocket } from 'tabler-icons-react';
import ElectionFactoryJSON from '../../../server/truffle/build/contracts/ElectionFactory.json';
import ElectionJSON from '../../../server/truffle/build/contracts/Election.json';
import { useElectionFactory } from 'hooks';
import axios from 'axios';
import { ApiEndpoints } from 'utils/constants';
import { useElectionStore } from 'context/ElectionStore';
import { loginErrorHandler } from 'utils/errorHandlers';
import { mutate, useSWRConfig } from 'swr';
import { NotificationProps, showNotification } from '@mantine/notifications';

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
  const {
    state: {
      election: { id: electionId },
    },
  } = useElectionStore();
  const electionFactory = useElectionFactory();
  const { mutate } = useSWRConfig();

  const metamaskUrl = `/${id}/settings/metamask`;

  const handleLaunch = async () => {
    if (!electionFactory) return;
    setLoading(true);
    const notificationObject: NotificationProps = {
      message: 'Something went wrong. Election is not launched.',
      color: 'red',
    };

    const election = await electionFactory.deploy(number);
    await election.deployTransaction.wait();
    console.log(election.address);

    try {
      const { data } = await axios.post(
        `${ApiEndpoints.election}/${electionId}/launch`,
        { address: election.address }
      );
      const { id } = data || {};
      if (id) {
        await mutate(`${ApiEndpoints.election}/${electionId}`);
        notificationObject.message = 'Election has been successfully deployed';
        notificationObject.color = 'green';
        notificationObject.icon = <Check size={18} />;
        nextStep();
      }
    } catch (error) {
      loginErrorHandler({ error: error } as { error: any });
    }
    setLoading(false);
    showNotification(notificationObject);
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
