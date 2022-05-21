import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Group,
  List,
  ListItem,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useElectionStore } from 'context/ElectionStore';
import { getQuestions } from 'hooks/fetchers';
import { FC, useState } from 'react';
import useSWR from 'swr';
import {
  ChevronRight,
  CircleCheck,
  CircleX,
  Cross,
  X,
} from 'tabler-icons-react';
import { ApiEndpoints } from 'utils/constants';

interface ConfirmDetailsProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
}

export const Terms: FC<ConfirmDetailsProps> = (props) => {
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
        Terms
      </Text>

      <Box>
        <Text>
          You{' '}
          <Text component='span' color='red'>
            will not be allowed
          </Text>{' '}
          to change following after your election launches:
        </Text>
        <List
          mt={8}
          mb={24}
          spacing='xs'
          size='sm'
          center
          icon={
            <ThemeIcon color='red' size={24} radius='xl'>
              <CircleX size={16} />
            </ThemeIcon>
          }>
          <List.Item>Add, Edit, or Delete Questions</List.Item>
          <List.Item>Change the election start date</List.Item>
        </List>
      </Box>
      <Box>
        <Text>
          You{' '}
          <Text component='span' color='green'>
            will be allowed
          </Text>{' '}
          to change following after your election launches:
        </Text>
        <List
          mt={8}
          mb={24}
          spacing='xs'
          size='sm'
          center
          icon={
            <ThemeIcon color='green' size={24} radius='xl'>
              <CircleCheck size={16} />
            </ThemeIcon>
          }>
          <List.Item>Extend your election end date</List.Item>
          <List.Item>Close the election</List.Item>
        </List>
      </Box>

      <Checkbox
        my='xl'
        color='cyan'
        checked={checked}
        onChange={(e) => setChecked(e.currentTarget.checked)}
        label='I understand and agree to the terms'
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
