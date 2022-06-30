import { VotingLayout } from 'layouts/Voting';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next';
import { withSessionSsr } from 'utils/configs';
import { prisma } from 'prisma/prisma';
import { Election, ElectionOption, Status, User } from '@prisma/client';
import {
  ActionIcon,
  Alert,
  Anchor,
  Box,
  Button,
  Card,
  Center,
  Collapse,
  Grid,
  Image,
  Radio,
  RadioGroup,
  Text,
  Title,
} from '@mantine/core';
import { VotingAuthLayout } from 'layouts/Voting/Auth';
import Head from 'next/head';
import { AlertCircle, Check, X } from 'tabler-icons-react';
import { FormEvent, useState } from 'react';
import UnderConstruction from 'public/images/under construction.svg';
import ElectionCompleted from 'public/images/election completed.svg';
import axios from 'axios';
import { useRouter } from 'next/router';

interface ServerSideData {
  election: Partial<Election> | null;
  options: ElectionOption[] | null;
  admin: Partial<User> | null;
  voter: number | null;
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async (context: GetServerSidePropsContext) => {
    const { query, req } = context;

    const { voter } = req.session as { voter: { id: number } };
    const { electionId = '' } = query;

    if (!voter) {
      return {
        redirect: {
          destination: `/election/vote/${electionId}/auth`,
          permanent: false,
        },
      };
    }

    const data: ServerSideData = {
      election: null,
      options: null,
      admin: null,
      voter: null,
    };

    if (electionId) {
      const {
        title,
        address,
        description,
        id,
        status,
        ElectionOption,
        userId,
      } =
        (await prisma.election.findFirst({
          where: { id: +electionId },
          include: { ElectionOption: true },
        })) || {};
      const { email } =
        (await prisma.user.findFirst({ where: { id: userId } })) || {};

      data.election = {
        address,
        description,
        id,
        status,
        title,
      };
      data.options = ElectionOption || null;
      data.admin = { email };
    }
    data.voter = voter.id;

    return { props: { data } };
  }
);

const VotingPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
  const { data } = props;
  const { push } = useRouter();
  const { election, options = [], admin, voter } = data as ServerSideData;
  const { title, status, description } = election || {};
  const { email } = admin || {};

  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body = { option: +selectedOption };

      const { data } = await axios({
        method: 'POST',
        url: `/api/election/${election?.id}/voter/vote`,
        data: body,
      });

      const { message, voterId } = data;
      if (message && voterId) {
        push(`/election/vote/${election?.id}/success`);
      }
    } catch (error: any) {
      setErrorMessage(
        'Something went wrong. Please try again or contact admin'
      );
    }

    setLoading(false);
  };

  switch (status) {
    case 'COMPLETED':
      return (
        <VotingAuthLayout admin={email}>
          <Head>
            <title>Election Over</title>
          </Head>
          <Text size='xl' weight={600} mb={16}>
            Election Over
          </Text>
          <Image src={ElectionCompleted.src} alt='Construction Image' />
          <Text size='lg' mt={24}>
            This election has been closed by the admin. If you think this is a
            mistake please contact the{' '}
            <Anchor color='cyan' size='lg' href={`mailto:${email}`}>
              admin
            </Anchor>
            .
          </Text>
        </VotingAuthLayout>
      );
    case 'DRAFT':
      return (
        <VotingAuthLayout>
          <Head>
            <title>Election under development</title>
          </Head>
          <Text size='xl' weight={600} mb={16}>
            Under Development
          </Text>
          <Image src={UnderConstruction.src} alt='Construction Image' />
          <Text size='lg' mt={24}>
            This election still under development.
            <br /> Please contact the{' '}
            <Anchor color='cyan' size='lg' href={`mailto:${email}`}>
              admin
            </Anchor>{' '}
            for any mistakes.
          </Text>
        </VotingAuthLayout>
      );
    case 'ONGOING':
    default:
      return (
        <VotingAuthLayout>
          <Head>
            <title>{title} | Vote</title>
          </Head>
          <Text size='xl' weight={600}>
            Vote for election:
          </Text>
          <Title order={2} style={{ fontWeight: 700 }} mb={8}>
            {title}
          </Title>
          <Text>{description}</Text>

          <Box
            component='form'
            style={{ textAlign: 'left' }}
            onSubmit={handleSubmit}>
            <Text size='md' weight={600} mt={8} mb={8}>
              Candidates
            </Text>

            <Collapse in={Boolean(errorMessage)}>
              <Alert
                icon={<AlertCircle size={16} />}
                color='red'
                withCloseButton>
                <Grid>
                  <Grid.Col span={10}>
                    <Text
                      color='red'
                      size='sm'
                      align='left'
                      style={{ flexGrow: 2 }}>
                      {errorMessage}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={2}>
                    <ActionIcon
                      variant='transparent'
                      color='red'
                      size='sm'
                      onClick={() => setErrorMessage('')}>
                      <X size={16} />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              </Alert>
            </Collapse>

            <RadioGroup
              required
              orientation='vertical'
              color='cyan'
              mt={8}
              value={selectedOption}
              onChange={setSelectedOption}>
              {(options || []).map((option) => {
                const { id, description, electionId, title } = option;

                return (
                  <Radio
                    disabled={loading}
                    key={id}
                    label={
                      <>
                        <Text>{title}</Text>
                        {description && <Text>, {description}</Text>}
                      </>
                    }
                    value={String(id)}
                  />
                );
              })}
            </RadioGroup>
            <Text size='xs' mt={16} mb={8}>
              Your vote will be anonymous
            </Text>
            <Button
              type='submit'
              disabled={!!!+selectedOption}
              loading={loading}
              color='cyan'
              variant='light'
              rightIcon={loading ? null : <Check size={20} />}>
              Vot{loading ? 'ing' : 'e'}
            </Button>
          </Box>
        </VotingAuthLayout>
      );
  }
};

export default VotingPage;
