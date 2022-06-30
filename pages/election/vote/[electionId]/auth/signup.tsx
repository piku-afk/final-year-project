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
import { useSetState } from '@mantine/hooks';
import { NotificationProps, showNotification } from '@mantine/notifications';
import axios from 'axios';
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
import { defaultHandler } from 'utils/errorHandlers';
import { ValidationMessages } from 'utils/validationMessages';
import { z } from 'zod';

const { email, password } = ZodValidators;
const dataSchema = z.object({
  email,
  password,
  confirmPassword: password,
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
    initialValues: { email: '', password: '', confirmPassword: '' },
    schema: zodResolver(dataSchema),
    validate: {
      confirmPassword: (value, values) =>
        value !== values.password
          ? ValidationMessages.signUp.confirmPassword
          : null,
    },
  });

  // @ts-ignore
  const { title = '', createdBy } = election || {};
  const { email: admin = '' } = createdBy || ({} as { email: string });

  const handleSignUp = async (formData: typeof form.values) => {
    const url = `/api/election/${electionId}/voter/signup`;
    const notificationObject: NotificationProps = {
      message: 'Successfully signed up for the election.',
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
      const { status, id } = data;
      if (status === 'success' && id) {
        push(`/election/vote/${electionId}/auth/signin`);
      }
      showNotification(notificationObject);
    } catch (error: any) {
      defaultHandler({ error, callback: setErrorMessage });
    }
    setLoading(false);
  };

  return (
    <VotingAuthLayout admin={admin}>
      <Head>
        <title>Sign Up | Election</title>
      </Head>
      <Title order={2} style={{ fontWeight: 600 }}>
        Sign up
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
              <Text color='red' size='sm' style={{ flexGrow: 2 }}>
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
        onSubmit={form.onSubmit(handleSignUp)}
        mt={16}>
        <Grid.Col xs={12}>
          <TextInput
            disabled={isValidating || loading}
            description='Enter the same email address that you have shared with admin'
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
        <Grid.Col xs={12}>
          <PasswordInput
            disabled={isValidating || loading}
            label='Confirm Password'
            required
            {...form.getInputProps('confirmPassword')}
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
            Sign{loading && 'ing'} Up for Election
          </Button>
        </Grid.Col>
        <Grid.Col style={{ textAlign: 'center' }}>
          <Text mb={4} size='sm'>
            Already signed up ?
          </Text>
          <Anchor
            href={`/election/vote/${electionId}/auth/signin`}
            color='cyan'>
            Sign In
          </Anchor>
        </Grid.Col>
      </Grid>
    </VotingAuthLayout>
  );
};

export default VotingSignUpPage;
