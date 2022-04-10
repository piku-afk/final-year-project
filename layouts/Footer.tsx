import {
  Anchor,
  Container,
  Footer as MantineFooter,
  Text,
} from '@mantine/core';
import { Constants } from 'utils/constants';
import { useMediaQuery } from 'hooks';
import { FC } from 'react';

interface FooterProps {
  background?: 'white' | 'transparent';
}

export const Footer: FC<FooterProps> = (props) => {
  const { background = 'white', children } = props;
  const { isSmall, isLarge } = useMediaQuery();

  return (
    <>
      {children}
      <MantineFooter
        height='auto'
        py={32}
        sx={(theme) => ({
          backgroundColor: background || 'transparent',
          color: background === 'white' ? 'inherit' : theme.colors.gray[2],
        })}>
        <Container size={isSmall ? 'sm' : isLarge ? 'md' : 'xl'}>
          <Text size='sm' component='p' mb={0}>
            {Constants.projectName} is a final year project made by the
            8th-semester students of{' '}
            <Anchor
              color='cyan'
              sx={(theme) => ({
                '&:hover': { color: theme.colors.cyan[7] },
              })}
              inherit
              href='https://www.acharya.ac.in/'
              target='_blank'
              rel='noreferrer'>
              Acharya Institute of Technology
            </Anchor>{' '}
            in fulfillment for the award of the degree of{' '}
            <strong>
              Bachelor of Engineering in Computer Science &amp; Engineering
            </strong>{' '}
            of the{' '}
            <Anchor
              color='cyan'
              sx={(theme) => ({
                '&:hover': { color: theme.colors.cyan[7] },
              })}
              inherit
              href='https://vtu.ac.in/en/'
              target='_blank'
              rel='noreferrer'>
              Visvesvaraya Technological University
            </Anchor>{' '}
            , Belgaum during the academic year 2021-2022.{' '}
          </Text>
        </Container>
      </MantineFooter>
    </>
  );
};
