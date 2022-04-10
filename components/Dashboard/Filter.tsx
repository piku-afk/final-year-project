import { Box, Grid, Input, Select, useMantineTheme } from '@mantine/core';
import { Search } from 'tabler-icons-react';

export const Filter = () => {
  const theme = useMantineTheme();

  return (
    <Box mt={32}>
      <Grid justify='space-between'>
        <Grid.Col xs={4}>
          <Input
            icon={<Search size={20} strokeWidth={1.5} />}
            placeholder='Search by election title'
          />
        </Grid.Col>
        <Grid.Col xs={2}>
          <Select
            clearable
            placeholder='Filter by status'
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
