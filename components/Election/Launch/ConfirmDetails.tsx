import {
  Button,
  Card,
  Container,
  Group,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useElectionStore } from 'context/ElectionStore';
import dayjs from 'dayjs';
import { FC } from 'react';
import { ChevronRight } from 'tabler-icons-react';

const formatDate = (date: Date | null | undefined) =>
  dayjs(date).format('DD MMMM, YYYY');

interface ConfirmDetailsProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
}

export const ConfirmDetails: FC<ConfirmDetailsProps> = (props) => {
  const { step, nextStep, prevStep } = props;
  const {
    state: {
      election: { description, end, start, title },
    },
  } = useElectionStore();

  return (
    <Card component={Container} size='sm'>
      <Text size='xl' weight={600}>
        Confirm Election Details
      </Text>

      <Table mt={16} fontSize='md'>
        <tbody>
          <tr>
            <Text component='td' weight={600}>
              Title
            </Text>
            <td>{title}</td>
          </tr>
          <tr>
            <Text component='td' weight={600}>
              Description
            </Text>
            <td>{description}</td>
          </tr>
          <tr>
            <Text component='td' weight={600}>
              Start Date
            </Text>
            <td>{formatDate(start)}</td>
          </tr>
          <tr>
            <Text component='td' weight={600}>
              End Date
            </Text>
            <td>{formatDate(end)}</td>
          </tr>
        </tbody>
      </Table>

      <Group position='left' mt='xl'>
        <Button
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
