import {
  ActionIcon,
  Alert,
  Button,
  Card,
  Center,
  Collapse,
  Grid,
  Paper,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import axios, { AxiosError } from 'axios';
import { useGlobalStore } from 'context/GlobalStore';
import { useMediaQuery } from 'hooks';
import { withSettingsLayout } from 'layouts';
import { NextPageWithLayout } from 'next';
import Image from 'next/image';
import SecuritySvg from 'public/images/my_password_re_ydq7.svg';
import { useState } from 'react';
import { showNotification, NotificationProps } from '@mantine/notifications';
import { AlertCircle, Check, X } from 'tabler-icons-react';
import { defaultHandler } from 'utils/errorHandlers';
import { ZodValidators } from 'utils';
import { z } from 'zod';
import { useRouter } from 'next/router';

const { password } = ZodValidators;
const dataSchema = z.object({
  currentPassword: password,
  newPassword: password,
});

const Security: NextPageWithLayout = () => {
  const {
    state: {
      currentUser: { name },
    },
  } = useGlobalStore();
  const { isExtraSmall, isSmall } = useMediaQuery();
  const form = useForm({
    initialValues: {
      currentPassword: '',
      newPassword: '',
    },
    schema: zodResolver(dataSchema),
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { push } = useRouter();

  const handleSubmit = async (formData: typeof form.values) => {
    setLoading(true);
    setErrorMessage('');
    try {
      await axios.post('/api/auth/password-reset', formData);
      push('/login');
      showNotification({
        message: 'Password updated successfully. Please login again.',
        color: 'green',
        icon: <Check />,
      });
    } catch (error) {
      defaultHandler({ error: error as AxiosError, callback: setErrorMessage });
    }
    setLoading(false);
  };

  return (
    <Grid gutter={isExtraSmall ? undefined : 'xl'}>
      <Grid.Col
        // @ts-ignore
        lg={5}
        sm={6}>
        <Card>
          <Text component='h2' style={{ fontSize: 24 }}>
            Security
          </Text>
          <Text component='h3' size='lg' my={16} color='gray'>
            Change Password
          </Text>

          <Collapse mb={16} in={Boolean(errorMessage)}>
            <Alert icon={<AlertCircle size={16} />} color='red' withCloseButton>
              <Grid>
                <Grid.Col span={10}>
                  <Text color='red' size='sm' style={{ flexGrow: 2 }}>
                    {errorMessage}
                  </Text>
                </Grid.Col>
                <Grid.Col span={2}>
                  <ActionIcon
                    ml='auto'
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
            onSubmit={form.onSubmit(handleSubmit)}>
            {isSmall && (
              // @ts-ignore
              <Grid.Col component={Center}>
                <Image src={SecuritySvg.src} alt='' width={200} height={200} />
              </Grid.Col>
            )}

            <Grid.Col>
              <PasswordInput
                disabled={loading}
                label='Current Password'
                autoComplete='off'
                {...form.getInputProps('currentPassword')}
              />
            </Grid.Col>
            <Grid.Col>
              <PasswordInput
                disabled={loading}
                label='New Password'
                autoComplete='new-password'
                {...form.getInputProps('newPassword')}
              />
            </Grid.Col>
            <Grid.Col>
              <Text color='cyan' weight={600} size='sm'>
                You will be logged out.
              </Text>
            </Grid.Col>
            <Grid.Col>
              <Button
                loading={loading}
                type='submit'
                color='cyan'
                variant='light'>
                Update
              </Button>
            </Grid.Col>
          </Grid>
        </Card>
      </Grid.Col>
      {!isSmall && (
        <Grid.Col lg={7} sm={6}>
          <Center className='h-100'>
            <Image
              src={SecuritySvg.src}
              width={400}
              height={280}
              alt='profile'
            />
          </Center>
        </Grid.Col>
      )}
    </Grid>
  );
};

Security.getLayout = withSettingsLayout;

export default Security;
