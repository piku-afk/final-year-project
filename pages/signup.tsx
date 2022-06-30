import {
  ActionIcon,
  Alert,
  Button,
  Collapse,
  Grid,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { LoginLayout } from 'layouts/Login';
import { NextPage } from 'next';
import Link from 'next/link';
import WelcomeCatSvg from 'public/images/welcome_cats_thqn.svg';
import Head from 'next/head';
import { useForm } from '@mantine/form';
import { NotificationProps, showNotification } from '@mantine/notifications';
import { AlertCircle, Check, X } from 'tabler-icons-react';
import axios from 'axios';
import { AlertMessages } from 'utils/alertMessages';
import { useRouter } from 'next/router';
import { ValidationMessages } from 'utils/validationMessages';
import { useState } from 'react';
import { loginErrorHandler } from 'utils/errorHandlers/login';

const SignUp: NextPage = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: {
      name: (value) =>
        value.length < 3 ? ValidationMessages.signUp.name : null,
      password: (value) =>
        value.length < 6 ? ValidationMessages.signUp.password : null,
      confirmPassword: (value, values) =>
        value !== values.password
          ? ValidationMessages.signUp.confirmPassword
          : null,
    },
  });

  const handleSubmit = async (formData: typeof form.values) => {
    const { name, email, password } = formData;
    const notificationObject: NotificationProps = {
      message: AlertMessages.signup.success,
      color: 'green',
      icon: <Check />,
    };
    setErrorMessage('');
    setLoading(true);
    try {
      await axios({
        url: '/api/auth/signup',
        method: 'POST',
        data: { email, name, password },
      });
      push('/login');
      showNotification(notificationObject);
    } catch (error: any) {
      loginErrorHandler({
        error,
        callback: setErrorMessage,
      });
    }
    setLoading(false);
  };

  return (
    <LoginLayout image={WelcomeCatSvg}>
      <Head>
        <title>Register | Voting dApp</title>
      </Head>
      <Text align='center' my={16}>
        Get started by creating an account.
      </Text>

      <Collapse in={Boolean(errorMessage)}>
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

      {/* @ts-ignore */}
      <Grid mt={4} component='form' onSubmit={form.onSubmit(handleSubmit)}>
        <Grid.Col xs={12}>
          <TextInput
            disabled={loading}
            label='Full Name'
            required
            {...form.getInputProps('name')}
          />
        </Grid.Col>
        <Grid.Col xs={12}>
          <TextInput
            disabled={loading}
            label='Email'
            type='email'
            required
            {...form.getInputProps('email')}
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <PasswordInput
            disabled={loading}
            label='Password'
            required
            {...form.getInputProps('password')}
          />
        </Grid.Col>
        <Grid.Col xs={6}>
          <PasswordInput
            disabled={loading}
            label='Confirm Password'
            required
            {...form.getInputProps('confirmPassword')}
          />
        </Grid.Col>
        <Grid.Col>
          <Button
            disabled={loading}
            loading={loading}
            fullWidth
            color='teal'
            type='submit'>
            Sign{loading && 'ing'} Up
          </Button>
        </Grid.Col>
      </Grid>

      <Text align='center' size='sm' mt={8}>
        Already a user ?&nbsp;
        <Link href='/login' passHref>
          <Text
            style={{ fontWeight: 600 }}
            inherit
            component='a'
            variant='link'
            color='teal'>
            Log in
          </Text>
        </Link>
      </Text>
    </LoginLayout>
  );
};

export default SignUp;
