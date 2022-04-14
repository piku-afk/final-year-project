import { Button, Center, Grid, Text, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useMediaQuery } from 'hooks';
import Image from 'next/image';
import ProfileSvg from 'public/images/profile_data_re_v81r.svg';
import { z } from 'zod';
import { ZodValidators } from 'utils/zodValidators';
import { useUser } from 'hooks/fetchers';
import useSWR from 'swr';
import { User } from '@prisma/client';
import { useEffect, useMemo, useState } from 'react';
import { useGlobalStore } from 'context/GlobalStore';

const { email, name, organization, makeOptionalString } = ZodValidators;
const dataSchema = z.object({
  email: makeOptionalString(email),
  name: makeOptionalString(name),
  organization: makeOptionalString(organization),
});

// initialValues: useMemo(() => {
//   if (isValidating) {
//     return { email, name, organization };
//   }
//   return { email: '', name: '', organization: '' };
// }, [data, isValidating]),

export const General = () => {
  const { isSmall } = useMediaQuery();
  const { state } = useGlobalStore();
  const { currentUser } = state;
  const [init, setInit] = useState(true);
  const form = useForm({
    schema: zodResolver(dataSchema),
    initialValues: { name: '', email: '', organization: '' },
  });

  useEffect(() => {
    if (init) {
      const { name, email, organization } = currentUser;
      form.setValues({ email, name, organization });
      setInit(false);
    }
  }, [init, currentUser, form]);

  const handleSubmit = async (formData: typeof form.values) => {
    console.log(formData);
  };

  return (
    <>
      <Text component='h2' style={{ fontSize: 24 }}>
        General
      </Text>
      <Text component='h3' size='lg' my={16} color='gray'>
        User Details
      </Text>
      <Grid
        // @ts-ignore
        component='form'
        style={{ maxWidth: 400 }}
        onSubmit={form.onSubmit(handleSubmit)}>
        {isSmall && (
          // @ts-ignore
          <Grid.Col component={Center}>
            <Image src={ProfileSvg.src} alt='' width={200} height={200} />
          </Grid.Col>
        )}
        <Grid.Col>
          <TextInput
            label='Name'
            description='Your name or the name of the primary contact of the account.'
            {...form.getInputProps('name')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            label='Email'
            type='email'
            {...form.getInputProps('email')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            label='Organization Name'
            description='The organization name will be displayed to voters when logging in and voting in your elections.'
            {...form.getInputProps('organization')}
          />
        </Grid.Col>
        <Grid.Col>
          <Button type='submit' color='cyan' variant='light'>
            Update
          </Button>
        </Grid.Col>
      </Grid>
    </>
  );
};
