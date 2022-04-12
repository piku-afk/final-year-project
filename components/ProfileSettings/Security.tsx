import {
  Button,
  Center,
  Grid,
  PasswordInput,
  Text,
  Title,
} from '@mantine/core';

import SecuritySvg from 'public/images/my_password_re_ydq7.svg';
import Image from 'next/image';
import { useMediaQuery } from 'hooks';

export const Security = () => {
  const { isSmall } = useMediaQuery();

  return (
    <>
      <Text component='h2' style={{ fontSize: 24 }}>
        Security
      </Text>
      <Text component='h3' size='lg' my={16} color='gray'>
        Change Password
      </Text>
      {/* @ts-ignore */}
      <Grid component='form' style={{ maxWidth: 400 }}>
        {isSmall && (
          // @ts-ignore
          <Grid.Col component={Center}>
            <Image src={SecuritySvg.src} alt='' width={144} height={144} />
          </Grid.Col>
        )}
        <Grid.Col>
          <PasswordInput label='Current Password' autoComplete='off' />
        </Grid.Col>
        <Grid.Col>
          <PasswordInput label='New Password' autoComplete='new-password' />
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
