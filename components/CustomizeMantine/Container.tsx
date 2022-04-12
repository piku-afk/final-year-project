import { Container, ContainerProps } from '@mantine/core';
import { useMediaQuery } from 'hooks';
import { FC } from 'react';

export const CustomContainer: FC<ContainerProps> = (props) => {
  const { isLarge, isMedium } = useMediaQuery();

  return (
    <Container size={isMedium ? 'sm' : isLarge ? 'md' : 'xl'} {...props} />
  );
};
