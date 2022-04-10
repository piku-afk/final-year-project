import {
  Button,
  Container,
  Header as MantineHeader,
  Title,
} from '@mantine/core';
import { Constants } from 'utils/constants';
import Link from 'next/link';
import { FC } from 'react';

export const Header: FC = ({ children }) => {
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
          {/* <Button>Create New Election</Button> */}
        </MantineHeader>
      </Container>
      {children}
    </>
  );
};
