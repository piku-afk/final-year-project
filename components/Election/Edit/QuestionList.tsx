import {
  Accordion,
  ActionIcon,
  Box,
  Button,
  Card,
  Grid,
  Group,
  Skeleton,
  Spoiler,
  Text,
  Tooltip,
} from '@mantine/core';
import { ElectionOption } from '@prisma/client';
import { useElectionStore } from 'context/ElectionStore';
import { useDeleteOption, useDeleteQuestion, useMediaQuery } from 'hooks';
import { getQuestions } from 'hooks/fetchers';
import { useState } from 'react';
import useSWR from 'swr';
import { Pencil, Plus, Trash } from 'tabler-icons-react';
import { ApiEndpoints } from 'utils/constants';
import { NewQuestion } from './NewOption';

const initialQuestion = {
  id: 0,
  title: '',
  description: '',
  electionId: 0,
};

const initialOption = {
  id: 0,
  title: '',
  description: '',
  electionId: 0,
};

export const OptionList = () => {
  const {
    state: {
      election: { id, status },
    },
  } = useElectionStore();
  const { isValidating, data, mutate } = useSWR(
    `${ApiEndpoints.election}/${id}/options`,
    getQuestions
  );
  const isLive = status === 'ONGOING';

  const handleOptionDelete = useDeleteOption();
  const [showNewOption, setShowNewOption] = useState(false);
  const [selectedOption, setSelectedOption] =
    useState<ElectionOption>(initialOption);

  return isValidating && data ? (
    <>
      <Skeleton width={200} height={24} my={16} />
      {Array.from(Array(4).keys()).map((item) => (
        <Card key={item} my={16}>
          <Skeleton width={200} height={12} />
        </Card>
      ))}
    </>
  ) : (
    <Card mt={24}>
      <Text size='xl' my={16} weight={600} pl={16}>
        Added Options
      </Text>

      <ul className='list-group list-group-flush'>
        {data &&
          data.map((option) => {
            const { id, title, description } = option;
            return (
              <li key={id} className='list-group-item'>
                <Grid>
                  <Grid.Col
                    sm={isLive ? 12 : 11}
                    xs={isLive ? 12 : 10.5}
                    span={isLive ? 12 : 9}>
                    <Text size='sm' weight={600}>
                      {title}
                    </Text>
                    <Text size='sm' color='gray'>
                      {description}
                    </Text>
                  </Grid.Col>
                  {!isLive && (
                    <Grid.Col
                      sm={1}
                      xs={1.5}
                      span={3}
                      className='d-flex justify-content-end'>
                      <Tooltip label='Edit'>
                        <ActionIcon
                          color='cyan'
                          variant='light'
                          onClick={() => {
                            setShowNewOption(true);
                            setSelectedOption(option);
                          }}>
                          <Pencil size={18} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={`Delete ${title}`} ml={8}>
                        <ActionIcon
                          color='red'
                          variant='light'
                          onClick={() =>
                            handleOptionDelete({
                              mutate,
                              optionId: id,
                              title,
                            })
                          }>
                          <Trash size={18} />
                        </ActionIcon>
                      </Tooltip>
                    </Grid.Col>
                  )}
                </Grid>
              </li>
            );
          })}
      </ul>

      <NewQuestion
        open={showNewOption}
        onClose={() => {
          setShowNewOption(false);
          setSelectedOption(initialOption);
        }}
        option={selectedOption}
      />
    </Card>
  );
};
