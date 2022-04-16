import {
  Card,
  Center,
  Container,
  Grid,
  Group,
  Overlay,
  RingProgress,
  Text,
  Title,
} from '@mantine/core';
import { Users } from 'tabler-icons-react';

const stats = [
  { label: 'Voters Count', icon: Users, color: 'orange' },
  { label: 'Questions', icon: Users, color: 'grape' },
];

export const Status = () => {
  return (
    <Grid gutter='xl'>
      {stats.map(({ color, icon: Icon, label }) => (
        <Grid.Col key={label} xs={6}>
          <Card withBorder>
            <Group>
              <RingProgress
                size={80}
                roundCaps
                thickness={8}
                sections={[{ value: 100, color }]}
                label={
                  <Center>
                    {/* <Icon size={22} /> */}
                    <Icon color='gray' size={20} />
                  </Center>
                }
              />
              <div>
                <Text
                  color='dimmed'
                  size='sm'
                  transform='uppercase'
                  weight={700}>
                  {label}
                </Text>
                <Text weight={700} size='xl'>
                  1
                </Text>
              </div>
            </Group>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );
};
