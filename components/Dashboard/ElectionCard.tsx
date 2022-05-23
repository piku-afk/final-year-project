import {
  ActionIcon,
  Card,
  Center,
  Grid,
  MantineTheme,
  Paper,
  Skeleton,
  Text,
  Tooltip,
} from '@mantine/core';
import { Election, Status } from '@prisma/client';
import { FC } from 'react';
import dayjs from 'dayjs';
import { useDeleteElection, useMediaQuery } from 'hooks';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import { NextLink } from '@mantine/next';
import { Trash } from 'tabler-icons-react';
import { KeyedMutator } from 'swr';

dayjs.extend(localizedFormat);

interface ElectionCardProps {
  election: Election;
  mutate: KeyedMutator<Election[]>;
}

const getColor = (theme: MantineTheme, status: Status) => {
  switch (status) {
    case 'COMPLETED':
      return {
        backgroundColor: theme.colors.red[2],
        color: theme.colors.red[8],
      };
    case 'DRAFT':
      return {
        backgroundColor: theme.colors.yellow[2],
        color: theme.colors.yellow[8],
      };
    case 'ONGOING':
      return {
        backgroundColor: theme.colors.green[2],
        color: theme.colors.green[8],
      };
  }
};

const formatDate2 = (date: Date | null) => {
  return date ? dayjs(date).format('LL') : '';
};

export const ElectionCard: FC<ElectionCardProps> = (props) => {
  const { election, mutate } = props;
  const { id, title, description, start, end, status } = election;
  const { isExtraSmall } = useMediaQuery();
  const handleDelete = useDeleteElection(id, title);

  return (
    <Card style={{ color: 'initial' }} withBorder mb={16}>
      <Grid justify='space-between' align='center'>
        <Grid.Col
          // @ts-ignore
          component={NextLink}
          href={`/election/${id}`}
          lg={8}
          sm={6.2}
          xs={5}
          span={10}
          style={{ order: 0 }}>
          <Text color='dark' weight={600} size='lg'>
            {title}
          </Text>
          <Text color='dark' size='sm' lineClamp={2}>
            {description}
          </Text>
        </Grid.Col>
        <Grid.Col
          // @ts-ignore
          component={NextLink}
          href={`/election/${id}`}
          lg={2.5}
          sm={3.5}
          xs={4.5}
          span={8}
          style={{ order: 1 }}>
          {start ? (
            <>
              <Text color='dark' weight={600} size='md'>
                Duration
              </Text>
              <Text color='dark'>
                {!end
                  ? `Starts from ${formatDate2(start)}`
                  : formatDate2(start)}{' '}
                {end && '-'} {formatDate2(end)}
              </Text>
            </>
          ) : (
            <Center className='h-100'>
              <Text color='gray' weight={500} size='sm'>
                Duration not specified
              </Text>
            </Center>
          )}
        </Grid.Col>
        <Grid.Col
          // @ts-ignore
          component={NextLink}
          href={`/election/${id}`}
          lg={1}
          sm={1.5}
          xs={1.5}
          span={4}
          style={{
            textAlign: 'right',
            marginTop: isExtraSmall ? 'auto' : 0,
            order: 1,
          }}>
          <Text
            // color='dark'
            className='border'
            component='span'
            // transform='capitalize'
            size='sm'
            weight={600}
            sx={(theme) => ({
              borderRadius: 8,
              marginTop: 'auto',
              ...getColor(theme, status),
            })}
            px={8}
            py={4}>
            {status}
          </Text>
        </Grid.Col>
        <Grid.Col
          style={{ order: isExtraSmall ? 0 : 1 }}
          lg={0.5}
          sm={0.8}
          xs={1}
          span={2}>
          <Tooltip label={`Delete ${title}`} style={{ width: '100%' }}>
            <ActionIcon
              color='red'
              onClick={() => handleDelete(mutate)}
              ml='auto'
              mr={isExtraSmall ? 'auto' : undefined}>
              <Trash size={22} />
            </ActionIcon>
          </Tooltip>
        </Grid.Col>
      </Grid>
    </Card>
  );
};

export const ElectionCardSkeleton = () => {
  return (
    <Card withBorder mb={16}>
      <Grid justify='space-between'>
        <Grid.Col xs={9}>
          <Skeleton height={14} visible={true} width={200} mb={8} />
          <Skeleton height={12} visible={true} />
        </Grid.Col>
        <Grid.Col xs={2} span={9}>
          <Skeleton height={12} visible={true} width={100} mb={8} />
          <Skeleton height={12} visible={true} />
        </Grid.Col>
        <Grid.Col xs={1} span={3}>
          <Skeleton height={12} visible={true} width={50} mb={8} ml='auto' />
        </Grid.Col>
      </Grid>
    </Card>
  );
};
