import { Box, Grid, Select, TextInput, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from 'hooks';
import { FC } from 'react';
import { Search } from 'tabler-icons-react';

interface Filter {
  loading: boolean;
}

export const Filter: FC<Filter> = (props) => {
  const { loading } = props;
  const { isExtraSmall } = useMediaQuery();

  return (
    <Box mt={32}>
      <Grid justify='space-between'>
        <Grid.Col xs={4} span={7}>
          <TextInput
            size='md'
            disabled={loading}
            icon={<Search size={20} strokeWidth={1.5} />}
            placeholder='Search by election title'
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
