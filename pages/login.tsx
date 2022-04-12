import { NextPage } from 'next';
import {
  ActionIcon,
  Alert,
  Button,
  Collapse,
  Grid,
  Group,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { NotificationProps, showNotification } from '@mantine/notifications';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LoginLayout } from 'layouts/Login';
import SecureLogin from 'public/images/secure_files_re_6vdh.svg';
import { useState } from 'react';
import { Check, X, Mail, Lock, AlertCircle } from 'tabler-icons-react';
import { ValidationMessages } from 'utils/validationMessages';
import { loginErrorHandler } from 'utils/errorHandlers/login';
import { Constants } from 'utils/constants';

interface FormInterface {
  email: string;
  password: string;
}

const Login: NextPage = () => {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const form = useForm<FormInterface>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      password: (value) =>
        value.length < 6 ? ValidationMessages.signUp.password : null,
    },
  });

  const handleSubmit = async (formData: FormInterface) => {
    const notificationObject: NotificationProps = {
      message: 'Successfully signed up.',
      color: 'green',
      icon: <Check />,
    };
    setLoading(true);
    setErrorMessage('');
    try {
      const { data } = await axios({
        method: 'POST',
        url: '/api/auth/login',
        data: formData,
      });
      const { message, userId } = data;
      if (message === 'success') {
        push(`/${userId}/dashboard`);
      }
      showNotification(notificationObject);
    } catch (error: any) {
      loginErrorHandler({ error, callback: setErrorMessage });
    }
    setLoading(false);
  };

  return (
    <LoginLayout image={SecureLogin}>
      <Head>
        <title>Login | Voting dApp</title>
      </Head>
      <Text align='center' my={16}>
        Welcome back, log in to continue to your account.
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
        <Grid.Col>
          <TextInput
            disabled={loading}
            icon={<Mail size={18} />}
            label='Email'
            type='email'
            required
            {...form.getInputProps('email')}
          />
        </Grid.Col>
        <Grid.Col>
          <PasswordInput
            disabled={loading}
            icon={<Lock size={18} />}
            label='Password'
            required
            {...form.getInputProps('password')}
          />
        </Grid.Col>
        <Grid.Col>
          <Button
            disabled={loading}
            loading={loading}
            type='submit'
            fullWidth
            color='teal'>
            Log In
          </Button>
        </Grid.Col>
      </Grid>

      <Text align='center' size='sm' mt={8}>
        Do not have an account ?&nbsp;
        <Link href='/signup' passHref>
          <Text
            style={{ fontWeight: 600 }}
            inherit
            component='a'
            variant='link'
            color='teal'>
            Sign up
          </Text>
        </Link>
      </Text>
    </LoginLayout>
  );
};

export default Login;
