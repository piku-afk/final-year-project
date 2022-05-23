import { Box, Grid, Select, TextInput } from '@mantine/core';
import { useMediaQuery } from 'hooks';
import { Dispatch, FC, SetStateAction } from 'react';
import { Search } from 'tabler-icons-react';

const filterOptions = [
  { value: 'ALL', label: 'All' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
];

interface Filter {
  loading: boolean;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
}

export const Filter: FC<Filter> = (props) => {
  const { loading, search, setSearch, status, setStatus } = props;
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
            placeholder={`Filter${isExtraSmall ? '' : ' by status'}`}
            data={filterOptions}
            value={status}
            onChange={(value) => setStatus(value || 'All')}
          />
        </Grid.Col>
      </Grid>
    </Box>
  );
};
