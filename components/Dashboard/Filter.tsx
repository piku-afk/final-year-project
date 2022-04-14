import { Box, Grid, Select, TextInput, useMantineTheme } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { useMediaQuery } from 'hooks';
import { Dispatch, FC, SetStateAction, useEffect, useRef } from 'react';
import { Search } from 'tabler-icons-react';

interface Filter {
  loading: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
}

export const Filter: FC<Filter> = (props) => {
  const { loading, search, setSearch } = props;
  const { isExtraSmall } = useMediaQuery();

  return (
    <Box>
      <Grid justify='space-between'>
        <Grid.Col xs={4} span={7}>
          <TextInput
            size='md'
            disabled={loading}
            icon={<Search size={20} strokeWidth={1.5} />}
            placeholder={isExtraSmall ? 'Search' : 'Search by election title'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid.Col>
        <Grid.Col xs={2} span={5}>
          <Select
            size='md'
            disabled={loading}
            clearable
            placeholder={`Filter${isExtraSmall ? '' : ' by status'}`}
            data={[
              { value: 'react', label: 'React' },
              { value: 'ng', label: 'Angular' },
              { value: 'svelte', label: 'Svelte' },
              { value: 'vue', label: 'Vue' },
            ]}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
};
