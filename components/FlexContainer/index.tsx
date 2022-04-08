import { Group, Stack } from '@mantine/core';
import { useMediaQuery } from 'hooks';
import { FC } from 'react';

interface FlexContainerProps {
  stackProps?: any;
  groupProps?: any;
}

export const FlexContainer: FC<FlexContainerProps> = (props) => {
  const { children, groupProps, stackProps } = props;

  const { isExtraSmall } = useMediaQuery();

  return isExtraSmall ? (
    <Stack {...stackProps}>{children}</Stack>
  ) : (
    <Group {...groupProps}>{children}</Group>
  );
};
