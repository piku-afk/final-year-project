import {
  ActionIcon,
  Alert,
  Anchor,
  Box,
  Button,
  Collapse,
  Grid,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { NotificationProps, showNotification } from '@mantine/notifications';
import axios, { AxiosError } from 'axios';
import { getElection } from 'hooks/fetchers';
import { VotingAuthLayout } from 'layouts/Voting/Auth';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useSWR from 'swr';
import { AlertCircle, Check, X } from 'tabler-icons-react';
import { ZodValidators } from 'utils';
import { ApiEndpoints } from 'utils/constants';
import { z } from 'zod';

const { email, password } = ZodValidators;
const dataSchema = z.object({
  email,
  password,
});

const VotingSignUpPage: NextPage = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {
    query: { electionId },
    push,
  } = useRouter();

  const { data: election, isValidating } = useSWR(
    `${ApiEndpoints.election}/${electionId}`,
    getElection
  );

  const form = useForm({
    initialValues: { email: '', password: '' },
    schema: zodResolver(dataSchema),
  });
  // @ts-ignore
  const { title = '', createdBy } = election || {};
  const { email: admin = '' } = createdBy || ({} as { email: string });

  const handleSignIn = async (formData: typeof form.values) => {
    const url = `/api/election/${electionId}/voter/signin`;
    const notificationObject: NotificationProps = {
      message: 'Successfully signed in.',
      color: 'green',
      icon: <Check />,
    };
    setLoading(true);
    setErrorMessage('');

    try {
      const { data } = await axios({
        method: 'POST',
        url,
        data: formData,
      });
      const { isEligible } = data;
      if (isEligible) {
        push(`/election/vote/${electionId}`);
        showNotification(notificationObject);
      } else {
        setErrorMessage(
          'It looks like you have already voted for this election.'
        );
      }
    } catch (error) {
      const { response } = error as AxiosError;
      const { data, status } = response || {};
      const { message } = data as { message: string };

      switch (status) {
        case 400:
          setErrorMessage(message || '');
          break;
        case 401:
          setErrorMessage('Something went wrong. Please try again.');
          break;
      }
    }
    setLoading(false);
  };

  return (
    <VotingAuthLayout admin={admin}>
      <Head>
        <title>Sign Up | Election</title>
      </Head>
      <Title order={2} style={{ fontWeight: 600 }}>
        Sign In
      </Title>
      <Text>
        For election{' '}
        <Text
          component='span'
          weight={600}
          style={{ textTransform: 'capitalize' }}>
          {title}
        </Text>
      </Text>

      <Collapse mt={16} mb={-8} in={Boolean(errorMessage)}>
        <Alert icon={<AlertCircle size={16} />} color='red' withCloseButton>
          <Grid>
            <Grid.Col span={10}>
              <Text color='red' size='sm' align='left' style={{ flexGrow: 2 }}>
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

      <Grid
        // @ts-ignore
        component='form'
        style={{ textAlign: 'initial' }}
        mt={16}
        onSubmit={form.onSubmit(handleSignIn)}>
        <Grid.Col xs={12}>
          <TextInput
            disabled={isValidating || loading}
            label='Email'
            required
            {...form.getInputProps('email')}
          />
        </Grid.Col>
        <Grid.Col xs={12}>
          <PasswordInput
            disabled={isValidating || loading}
            label='Password'
            required
            {...form.getInputProps('password')}
          />
        </Grid.Col>
        <Grid.Col>
          <Button
            type='submit'
            disabled={isValidating}
            loading={loading}
            fullWidth
            color='cyan'
            variant='light'>
            Sign In
          </Button>
        </Grid.Col>
        <Grid.Col style={{ textAlign: 'center' }}>
          <Text mb={4} size='sm'>
            Not signed up ?
          </Text>
          <Anchor
            href={`/election/vote/${electionId}/auth/signup`}
            color='cyan'>
            Sign Up
          </Anchor>
        </Grid.Col>
      </Grid>
    </VotingAuthLayout>
  );
};

export default VotingSignUpPage;
