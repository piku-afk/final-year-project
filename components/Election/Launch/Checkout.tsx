import { Button, Card, Container, Text } from '@mantine/core';
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

  const handleLaunch = () => {
    nextStep();
  };

  return (
    <Card component={Container} size='sm' className='text-center'>
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
    </Card>
  );
};
