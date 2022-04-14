import {
  Box,
  Button,
  Card,
  Center,
  Grid,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useGlobalStore } from 'context/GlobalStore';
import { useMediaQuery } from 'hooks';
import { NextPageWithLayout } from 'next';
import Image from 'next/image';
import { ZodValidators } from 'utils';
import { z } from 'zod';
import ProfileSvg from 'public/images/profile_data_re_v81r.svg';
import { withSettingsLayout } from 'layouts';
import axios from 'axios';
import { useSWRConfig } from 'swr';
import { useState } from 'react';
import { showNotification, NotificationProps } from '@mantine/notifications';
import { Check } from 'tabler-icons-react';

const { email, name, organization, makeOptionalString } = ZodValidators;
const dataSchema = z.object({
  email: makeOptionalString(email),
  name: makeOptionalString(name),
  organization: makeOptionalString(organization),
});

const General: NextPageWithLayout = () => {
  const {
    state: {
      currentUser: { name, email, organization },
    },
  } = useGlobalStore();
  const form = useForm({
    schema: zodResolver(dataSchema),
    initialValues: { name, email, organization },
  });
  const { isExtraSmall, isSmall } = useMediaQuery();
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: typeof form.values) => {
    setLoading(true);
    const { name, organization } = formData;
    const notificationObject: NotificationProps = {
      message: 'Something went wrong. Please try again later.',
      color: 'red',
    };
    try {
      await axios.put('/api/auth/user', { name, organization });
      await mutate('/api/auth/user');
      notificationObject.message = 'Profile details updated successfully';
      notificationObject.color = 'green';
      notificationObject.icon = <Check />;
    } catch (error) {
      console.log(error);
    }
    showNotification(notificationObject);
    setLoading(false);
  };

  return (
    // @ts-ignore
    <Grid gutter={isExtraSmall ? undefined : 'xl'}>
      <Grid.Col lg={5} sm={6}>
        <Card>
          <Text component='h2' style={{ fontSize: 24 }}>
            General
          </Text>
          <Text component='h3' size='lg' my={16} color='gray'>
            User Details
          </Text>
          <Grid
            // @ts-ignore
            component='form'
            onSubmit={form.onSubmit(handleSubmit)}>
            {isSmall && (
              // @ts-ignore
              <Grid.Col component={Center}>
                <Image src={ProfileSvg.src} alt='' width={200} height={200} />
              </Grid.Col>
            )}
            <Grid.Col>
              <TextInput
                disabled
                size={isExtraSmall ? 'md' : 'sm'}
                label='Email'
                type='email'
                {...form.getInputProps('email')}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                disabled={loading}
                size={isExtraSmall ? 'md' : 'sm'}
                label='Name'
                description='Your name or the name of the primary contact of the account.'
                {...form.getInputProps('name')}
              />
            </Grid.Col>
            <Grid.Col>
              <TextInput
                disabled={loading}
                size={isExtraSmall ? 'md' : 'sm'}
                label='Organization Name'
                description='The organization name will be displayed to voters when logging in and voting in your elections.'
                {...form.getInputProps('organization')}
              />
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
              src={ProfileSvg.src}
              width={400}
              height={400}
              alt='profile'
            />
          </Center>
        </Grid.Col>
      )}
    </Grid>
  );
};

General.getLayout = withSettingsLayout;

export default General;
