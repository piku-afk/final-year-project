import { Button, Card, Checkbox, Container, Group, Text } from '@mantine/core';
import { FC, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'tabler-icons-react';

interface ConfirmDetailsProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
}

export const CheckBallot: FC<ConfirmDetailsProps> = (props) => {
  const { prevStep, nextStep } = props;
  const [checked, setChecked] = useState(false);

  return (
    <Card component={Container} size='sm'>
      <Text size='xl' weight={600}>
        Check Ballot
      </Text>

      <Checkbox
        my='xl'
        color='cyan'
        checked={checked}
        onChange={(e) => setChecked(e.currentTarget.checked)}
        label='I understand that I cannot change my ballot after the election starts'
      />

      <Group position='left'>
        <Button variant='default' onClick={prevStep}>
          Back
        </Button>

        <Button
          disabled={!checked}
          color='cyan'
          variant='light'
          onClick={nextStep}
          rightIcon={<ChevronRight size={18} />}>
          Continue
        </Button>
      </Group>
    </Card>
  );
};
