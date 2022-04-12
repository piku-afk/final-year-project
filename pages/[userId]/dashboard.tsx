import { Box, Button, Container, Group, Title } from '@mantine/core';
import { ElectionCard, Filter, NewElection } from 'components/Dashboard';
import { CardContainer } from 'components/Dashboard/CardContainer';
import { useElections } from 'hooks/fetchers';
import { Footer, Header } from 'layouts';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { prisma } from 'prisma/prisma';
import { useState } from 'react';
import useSWR from 'swr';
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

const DashBoard: NextPage = () => {
  const [newElection, setNewElection] = useState(false);

  const {
    data: elections = [],
    isValidating,
    error,
  } = useSWR('/api/election', useElections);

  return (
    <Header>
      <Footer>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Container size='xl' py={32} style={{ minHeight: '80vh' }}>
          <Group className='justify-content-between'>
            <Title style={{ fontWeight: 600 }}>Dashboard</Title>
            <Button
              color='cyan'
              variant='light'
              onClick={() => setNewElection(true)}>
              Create New Election
            </Button>
          </Group>
          <Filter loading={isValidating} />
          <CardContainer elections={elections} loading={isValidating} />
          <NewElection
            open={newElection}
            onClose={() => setNewElection(false)}
          />
        </Container>
      </Footer>
    </Header>
  );
};

export default DashBoard;
