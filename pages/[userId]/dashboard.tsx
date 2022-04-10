import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Highlight,
  Paper,
  Text,
  Title,
} from '@mantine/core';
import { ElectionCard } from 'components/Dashboard/ElectionCard';
import { Filter } from 'components/Dashboard/Filter';
import { NewElection } from 'components/Dashboard/NewElection';
import { Footer } from 'layouts/Footer';
import { Header } from 'layouts/Header';
import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';

const DashBoard: NextPage = () => {
  const [newElection, setNewElection] = useState(false);

  return (
    <Header>
      <Footer>
        <Head>
          <title>Dashboard</title>
        </Head>
        <Container size='xl' py={32}>
          <Group className='justify-content-between'>
            <Title style={{ fontWeight: 600 }}>Dashboard</Title>
            <Button
              color='cyan'
              variant='light'
              onClick={() => setNewElection(true)}>
              Create New Election
            </Button>
          </Group>
          <Filter />
          <Box mt={32}>
            {Array.from(Array(5).keys()).map((item) => (
              <ElectionCard key={item} />
            ))}
          </Box>
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
