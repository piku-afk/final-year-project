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
  const [showError, setShowError] = useState(false);
  const form = useForm<FormInterface>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      password: (value) =>
        value.length < 3 ? ValidationMessages.signUp.password : null,
    },
  });

  const handleSubmit = async (formData: FormInterface) => {
    const notificationObject: NotificationProps = {
      message: 'Successfully signed up.',
      color: 'green',
      icon: <Check />,
    };
    setLoading(true);
    setShowError(false);
    try {
      const { data } = await axios({
        method: 'POST',
        url: '/api/auth/login',
        data: formData,
      });
      const { access_token, id } = data;
      if (access_token) {
        localStorage.setItem(Constants.tokenName, access_token);

        push(`/${id}/dashboard`);
      }
      showNotification(notificationObject);
    } catch (error: any) {
      loginErrorHandler({ error, callback: () => setShowError(true) });
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

      <Collapse in={showError}>
        <Alert icon={<AlertCircle size={16} />} color='red' withCloseButton>
          <Group>
            <Text color='red' size='sm' style={{ flexGrow: 1 }}>
              Incorrect email or password
            </Text>
            <ActionIcon
              variant='transparent'
              color='red'
              size='sm'
              onClick={() => setShowError(false)}>
              <X size={16} />
            </ActionIcon>
          </Group>
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
