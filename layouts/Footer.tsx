import {
  Anchor,
  BackgroundImage,
  Container,
  Footer as MantineFooter,
  Text,
} from '@mantine/core';
import { Constants } from 'assets/constants';
import { useMediaQuery } from 'hooks';
import { FC } from 'react';
import DotSvg from 'public/images/image.svg';

export const Footer: FC = ({ children }) => {
  const { isSmall, isLarge } = useMediaQuery();

  return (
    <>
      {children}
      <BackgroundImage
        sx={(theme) => ({
          backgroundColor: '#12283a',
          color: 'white',
          backgroundAttachment: 'fixed',
          borderTop: `1px solid ${theme.colors.gray[5]}`,
        })}
        src={DotSvg.src}
        component={MantineFooter}
        height='auto'
        py={32}>
        <Container size={isSmall ? 'sm' : isLarge ? 'md' : 'xl'}>
          <Text size='sm'>
            {Constants.projectName} is a product made as a final year project by
            the 8th-semester students of{' '}
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
            in fulfillment of the award of the degree of{' '}
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
      </BackgroundImage>
    </>
  );
};
