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
import { NewQuestion } from './NewQuestion';

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
      election: { id },
    },
  } = useElectionStore();
  const { isValidating, data, mutate } = useSWR(
    `${ApiEndpoints.election}/${id}/options`,
    getQuestions
  );
  const { isExtraSmall } = useMediaQuery();
  const handleQuestionDelete = useDeleteQuestion();
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
                  <Grid.Col xs={11}>
                    <Text size='sm' weight={600}>
                      {title}
                    </Text>
                    <Text size='sm' color='gray'>
                      {description}
                    </Text>
                  </Grid.Col>
                  <Grid.Col xs={1} className='d-flex justify-content-end'>
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

/*
      <Accordion
        iconPosition='right'
        multiple
        initialItem={0}
        styles={{
          itemTitle: { textTransform: 'capitalize' },
          item: { borderBottom: 'none' },
          label: { textTransform: 'capitalize' },
        }}>
        {data?.map((question) => {
          const { id: questionId, title, description } = question;
          return (
            <Accordion.Item key={questionId} label={title} my={16}>
              <Group style={{ flexWrap: 'nowrap', alignItems: 'flex-start' }}>
                <Spoiler
                  style={{ flexGrow: 1 }}
                  maxHeight={80}
                  showLabel='Show more'
                  hideLabel='Hide'>
                  <Text component='span' color='dimmed' weight={600}>
                    Description:{' '}
                  </Text>
                  {description}
                </Spoiler>
                <Box
                  mt={4}
                  style={{
                    minWidth: 64,
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}>
                  <Tooltip label='Create option'>
                    <ActionIcon
                      color='cyan'
                      variant='light'
                      onClick={() => {
                        setShowNewOption(true);
                      }}>
                      <Plus size={20} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label='Delete question' ml={8}>
                    <ActionIcon
                      color='red'
                      variant='light'
                      onClick={() =>
                        handleQuestionDelete({
                          title,
                          questionId: questionId,
                          mutate,
                        })
                      }>
                      <Trash size={20} />
                    </ActionIcon>
                  </Tooltip>
                </Box>
              </Group>
             {QuestionOption.length > 0 && (
                <>
                  <Text weight={600} my={8}>
                    Choices:
                  </Text>
                  <ol
                    style={{ borderRadius: 8 }}
                    className='list-group list-group-numbered list-group-flush'>
                    {QuestionOption.map((option) => {
                      const { id, title, description } = option;
                      return (
                        <li
                          key={id}
                          className='list-group-item d-flex justify-content-between align-items-start'>
                          <div
                            style={{ flexGrow: +isExtraSmall }}
                            className='ms-2 me-auto d-inline'>
                            <Text ml={8} transform='capitalize' weight={500}>
                              {title}
                            </Text>
                            <Text ml={8} size='sm' color='gray'>
                              {description}
                            </Text>

                            {isExtraSmall && (
                              <Group grow>
                                <Button
                                  size='xs'
                                  color='cyan'
                                  variant='light'
                                  leftIcon={<Pencil size={16} />}>
                                  Edit
                                </Button>
                              </Group>
                            )}
                          </div>
                          {!isExtraSmall && (
                            <div
                              style={{
                                marginRight: -16,
                              }}>
                              <Tooltip label='Edit'>
                                <ActionIcon
                                  color='cyan'
                                  variant='light'
                                  onClick={() => {
                                    setShowNewOption(true);
                                    setSelectedQuestion(question);
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
                                      questionId,
                                      optionId: id,
                                      title,
                                    })
                                  }>
                                  <Trash size={18} />
                                </ActionIcon>
                              </Tooltip>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ol>
                </>
              )} 
              </Accordion.Item>
              );
            })}
          </Accordion>
*/
