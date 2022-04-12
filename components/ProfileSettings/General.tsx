import { Button, Center, Grid, Text, TextInput } from '@mantine/core';
import { useMediaQuery } from 'hooks';
import Image from 'next/image';
import ProfileSvg from 'public/images/profile_data_re_v81r.svg';

export const General = () => {
  const { isSmall } = useMediaQuery();

  return (
    <>
      <Text component='h2' style={{ fontSize: 24 }}>
        General
      </Text>
      <Text component='h3' size='lg' my={16} color='gray'>
        User Details
      </Text>
      {/* @ts-ignore */}
      <Grid component='form' style={{ maxWidth: 400 }}>
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
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput label='Email' type='email' />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            label='Organization Name'
            description='The organization name will be displayed to voters when logging in and voting in your elections.'
          />
        </Grid.Col>
        <Grid.Col>
          <Button color='cyan' variant='light'>
            Update
          </Button>
        </Grid.Col>
      </Grid>
    </>
  );
};
