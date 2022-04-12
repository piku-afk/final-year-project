import {
  Button,
  Container,
  Header as MantineHeader,
  Menu,
  Title,
} from '@mantine/core';
import { Constants } from 'utils/constants';
import Link from 'next/link';
import { FC } from 'react';
import useSWR from 'swr';
import { useUser } from 'hooks/fetchers';
import { ChevronDown, Logout } from 'tabler-icons-react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';

export const Header: FC = ({ children }) => {
  const { data, error, isValidating } = useSWR('/api/auth/user', useUser);
  const { push } = useRouter();

  const { name } = data || {};

  const handleLogout = async () => {
    console.log('logout');
    await axios.get('/api/auth/logout');
    push('/login');
    showNotification({
      message: 'Logged out successfully',
      color: 'green',
    });
  };

  return (
    <>
      <Container fluid className='border-bottom'>
        <MantineHeader
          // @ts-ignore
          component={Container}
          size='xl'
          height='auto'
          className='w-100 d-flex justify-content-between border-bottom-0'
          style={{ background: 'transparent' }}
          py={24}>
          <Link href='/' passHref>
            {/* @ts-ignore */}
            <Title component='a' order={3} className='hero-background'>
              {Constants.projectName}
            </Title>
          </Link>

          <Menu
            // withArrow
            styles={{ body: { width: 'max-content', minWidth: 120 } }}
            placement='start'
            control={
              <Button
                size='sm'
                color='cyan'
                variant='subtle'
                rightIcon={<ChevronDown size={14} />}>
                {name}
              </Button>
            }>
            <Menu.Item icon={<Logout size={14} />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </MantineHeader>
      </Container>
      {children}
    </>
  );
};
