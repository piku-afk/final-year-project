import { Group, Stack } from '@mantine/core';
import { useMediaQuery } from 'hooks';
import { FC, PropsWithChildren } from 'react';

interface FlexContainerProps {
  stackProps?: any;
  groupProps?: any;
}

export const FlexContainer: FC<PropsWithChildren<FlexContainerProps>> = (
  props
) => {
  const { children, groupProps, stackProps } = props;

  const { isExtraSmall } = useMediaQuery();

  return isExtraSmall ? (
    <Stack {...stackProps}>{children}</Stack>
  ) : (
    <Group {...groupProps}>{children}</Group>
  );
};
