import {
  Card,
  Center,
  Container,
  DefaultMantineColor,
  Grid,
  Group,
  Overlay,
  RingProgress,
  Text,
  Title,
} from '@mantine/core';
import { useElectionStore } from 'context/ElectionStore';
import { FC } from 'react';
import { Icon, User, Users } from 'tabler-icons-react';

const stats = [
  { label: 'Voters Count', icon: Users, color: 'orange' },
  { label: 'Questions', icon: Users, color: 'grape' },
];

interface StatusCardProps {
  count: number;
  Icon: Icon;
  color: DefaultMantineColor;
  label: string;
}

const StatusCard: FC<StatusCardProps> = (props) => {
  const { label, count, Icon, color } = props;

  return (
    <Grid.Col xs={6}>
      <Card withBorder>
        <Group>
          <RingProgress
            size={80}
            roundCaps
            thickness={8}
            sections={[{ value: 100, color }]}
            label={
              <Center>
                <Icon color='gray' size={20} />
              </Center>
            }
          />
          <div>
            <Text color='dimmed' size='sm' transform='uppercase' weight={700}>
              {label}
            </Text>
            <Text weight={700} size='xl'>
              {count || 0}
            </Text>
          </div>
        </Group>
      </Card>
    </Grid.Col>
  );
};

export const Status = () => {
  const {
    state: { election },
  } = useElectionStore();
  const { _count } = election as { _count: { [key: string]: number } };
  const { ElectionOption, Voters } = _count || {};

  return (
    <Grid gutter='xl'>
      <StatusCard
        label='Total Voters'
        count={Voters}
        Icon={Users}
        color='orange'
      />
      <StatusCard
        label='Candidates'
        count={ElectionOption}
        Icon={Users}
        color='grape'
      />
    </Grid>
  );
};
