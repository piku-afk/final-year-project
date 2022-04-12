import {
  Button,
  Container,
  Header as MantineHeader,
  Menu,
  Paper,
  Title,
} from '@mantine/core';
import { Constants } from 'utils/constants';
import Link from 'next/link';
import { FC, RefObject, useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useUser } from 'hooks/fetchers';
import { ChevronDown, Logout, Settings, User } from 'tabler-icons-react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { showNotification } from '@mantine/notifications';
import { useMediaQuery } from 'hooks';
import { NextLink } from '@mantine/next';

interface Header {
  headerRef?: RefObject<HTMLDivElement>;
}

export const Header: FC<Header> = (props) => {
  const { headerRef, children } = props;
  const { data, error, isValidating } = useSWR('/api/auth/user', useUser);
  const { push } = useRouter();
  const [showShadow, setShowShadow] = useState(false);
  const { isExtraSmall } = useMediaQuery();

  const { name, id } = data || {};

  const handleLogout = async () => {
    console.log('logout');
    await axios.get('/api/auth/logout');
    push('/login');
    showNotification({
      message: 'Logged out successfully',
      color: 'green',
    });
  };

  const handleScroll = useCallback(() => {
    if (headerRef && headerRef.current && window.scrollY > 40) {
      return setShowShadow(true);
    }
    return setShowShadow(false);
  }, [headerRef]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <MantineHeader
        // @ts-ignore
        component={Paper}
        ref={headerRef}
        shadow={showShadow ? 'sm' : undefined}
        radius={0}
        fixed
        height='auto'
        style={{
          backgroundColor: 'inherit',
          transition: 'box-shadow 0.1s ease-out',
        }}>
        <Container
          size='xl'
          className='w-100 d-flex justify-content-between border-bottom-0'
          style={{ background: '#f8fafc' }}
          py={24}>
          <Link href='/' passHref>
            {/* @ts-ignore */}
            <Title component='a' order={3} className='hero-background'>
              {Constants.projectName}
            </Title>
          </Link>

          <Menu
            // withArrow
            styles={{
              body: { width: 136 },
              item: { '&:hover': { color: 'black' } },
            }}
            placement='start'
            control={
              <Button
                loading={isValidating}
                size='sm'
                color='cyan'
                variant='white'
                styles={{
                  root: { backgroundColor: 'inherit' },
                  leftIcon: isExtraSmall ? { marginRight: 0 } : {},
                }}
                leftIcon={<User size={18} />}
                rightIcon={<ChevronDown size={14} />}>
                {!isValidating && !isExtraSmall && name}
              </Button>
            }>
            <Menu.Item
              component={NextLink}
              href={`/${id}/settings`}
              icon={<Settings size={14} color='black' />}>
              Settings
            </Menu.Item>
            <Menu.Item icon={<Logout size={14} />} onClick={handleLogout}>
              Logout
            </Menu.Item>
          </Menu>
        </Container>
      </MantineHeader>
      {children}
    </>
  );
};
