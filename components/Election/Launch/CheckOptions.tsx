import { Button, Card, Checkbox, Container, Group, Text } from '@mantine/core';
import { useElectionStore } from 'context/ElectionStore';
import { getQuestions } from 'hooks/fetchers';
import { FC, useState } from 'react';
import useSWR from 'swr';
import { ChevronRight } from 'tabler-icons-react';
import { ApiEndpoints } from 'utils/constants';

interface ConfirmDetailsProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
}

export const CheckOptions: FC<ConfirmDetailsProps> = (props) => {
  const { prevStep, nextStep } = props;
  const [checked, setChecked] = useState(false);

  const {
    state: {
      election: { id },
    },
  } = useElectionStore();
  const { isValidating, data, mutate } = useSWR(
    `${ApiEndpoints.election}/${id}/options`,
    getQuestions
  );

  return (
    <Card component={Container} size='sm'>
      <Text size='xl' weight={600}>
        Check Options
      </Text>

      <ul className='list-group my-3'>
        {data &&
          data.map((option) => {
            const { id, title, description } = option;
            return (
              <li key={id} className='list-group-item'>
                <Text size='sm' weight={600}>
                  {title}
                </Text>
                <Text size='sm' color='gray'>
                  {description}
                </Text>
              </li>
            );
          })}
      </ul>

      <Checkbox
        my='xl'
        color='cyan'
        checked={checked}
        onChange={(e) => setChecked(e.currentTarget.checked)}
        label='I understand that I cannot change my options after the election starts'
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
