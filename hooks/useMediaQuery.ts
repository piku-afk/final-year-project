import { MantineSize, useMantineTheme } from '@mantine/core';
import { useMediaQuery as useMantineQuery } from '@mantine/hooks';

type queryType = 'largerThan' | 'smallerThan';

// not working
export const useMediaQuery = () => {
  const {
    breakpoints: { sm, xs, md, lg },
  } = useMantineTheme();
  const isExtraSmall = useMantineQuery(`(max-width: ${xs}px)`);
  const isSmall = useMantineQuery(`(max-width: ${sm}px)`);
  const isMedium = useMantineQuery(`(max-width: ${md}px)`);
  const isLarge = useMantineQuery(`(max-width: ${lg}px)`);

  return { isExtraSmall, isMedium, isSmall, isLarge };
};

// export const useMaxWidth = (size: MantineSize) => {
// };
