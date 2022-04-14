import {
  ActionIcon,
  Button,
  Container,
  Divider,
  Group,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { Filter, NewElection } from 'components/Dashboard';
import { CardContainer } from 'components/Dashboard/CardContainer';
import { useMediaQuery } from 'hooks';
import { useElections } from 'hooks/fetchers';
import { withDefaultLayout } from 'layouts';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  NextPageWithLayout,
} from 'next';
import Head from 'next/head';
import { prisma } from 'prisma/prisma';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';
import { Plus } from 'tabler-icons-react';
import { withSessionSsr } from 'utils/configs';

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async (context: GetServerSidePropsContext) => {
    const { req } = context;
    // @ts-ignore
    const { user } = req.session as { user: { id: number } };
    const redirectToLogin = {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

    if (!user || !user.id) {
      return redirectToLogin;
    }

    if (user) {
      const { id } = user;
      const savedUser = await prisma.user.findFirst({ where: { id } });
      if (!savedUser) {
        return redirectToLogin;
      }
    }
    return {
      props: {},
    };
  }
);

const DashBoard: NextPageWithLayout = () => {
  const { isExtraSmall } = useMediaQuery();
  const [newElection, setNewElection] = useState(false);

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 1000);
  const {
    data: elections = [],
    isValidating,
    mutate,
  } = useSWR(
    {
      url: '/api/election',
      ...(debouncedSearch && { search: debouncedSearch }),
    },
    useElections,
    {
      focusThrottleInterval: 60 * 1000,
    }
  );

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <Group mb={32} className='justify-content-between'>
        <Title style={{ fontWeight: 600 }}>Dashboard</Title>
        {isExtraSmall ? (
          <ActionIcon color='cyan' variant='light' size='lg'>
            <Plus size={20} />
          </ActionIcon>
        ) : (
          <Button
            color='cyan'
            variant='light'
            onClick={() => setNewElection(true)}>
            Create New Election
          </Button>
        )}
      </Group>
      <Filter search={search} setSearch={setSearch} loading={isValidating} />
      <CardContainer elections={elections} loading={isValidating} />
      <NewElection open={newElection} onClose={() => setNewElection(false)} />
    </>
  );
};

DashBoard.getLayout = withDefaultLayout;

export default DashBoard;
