import {
  Accordion,
  AccordionItem,
  ActionIcon,
  Alert,
  Button,
  Card,
  Collapse,
  Grid,
  Group,
  Text,
  Textarea,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { showNotification, NotificationProps } from '@mantine/notifications';
import axios from 'axios';
import { NewQuestion, OptionList } from 'components/Election/Edit';
import { ElectionActionTypes } from 'context/electionReducer';
import { useElectionStore } from 'context/ElectionStore';
import { useDeleteElection, useMediaQuery } from 'hooks';
import { withElectionLayout } from 'layouts/Election';
import { NextPageWithLayout } from 'next';
import { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import { AlertCircle, Check, Plus, Trash, X } from 'tabler-icons-react';
import { ZodValidators } from 'utils';
import { ApiEndpoints } from 'utils/constants';
import { loginErrorHandler } from 'utils/errorHandlers';
import { z } from 'zod';

const { title, description } = ZodValidators;
const dataSchema = z.object({ title, description });

const EditElection: NextPageWithLayout = () => {
  const {
    state: {
      election: { title, description, id },
    },
    dispatch,
  } = useElectionStore();

  const { setValues, ...form } = useForm({
    initialValues: { title, description },
    schema: zodResolver(dataSchema),
  });
  const [showNewOption, setShowNewOption] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { mutate } = useSWRConfig();
  const handleDelete = useDeleteElection(id, title);
  const { isExtraSmall } = useMediaQuery();

  useEffect(() => {
    setValues({ title: title || '', description: description || '' });
  }, [title, description, setValues]);

  const handleElectionSubmit = async (formData: typeof form.values) => {
    const notificationObject: NotificationProps = {
      message: 'Election details updated successfully',
      color: 'green',
      icon: <Check />,
    };
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${ApiEndpoints.election}/${id}`,
        formData
      );
      await mutate(ApiEndpoints.election);
      showNotification(notificationObject);

      const { title, description } = data;
      dispatch({
        type: ElectionActionTypes.setElection,
        payload: { title, description },
      });
    } catch (error: any) {
      loginErrorHandler({ error, callback: setErrorMessage });
    }
    setLoading(false);
  };

  return (
    <>
      <Group mb={16} position='center' spacing='sm'>
        {isExtraSmall ? (
          <>
            <Tooltip label='Create new question' ml='auto'>
              <ActionIcon
                onClick={() => setShowNewOption(true)}
                color='cyan'
                variant='light'>
                <Plus size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={`Delete ${title}`}>
              <ActionIcon
                variant='light'
                color='red'
                onClick={() => handleDelete()}>
                <Trash size={20} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : (
          <>
            <Button
              ml='auto'
              leftIcon={<Plus size={18} />}
              onClick={() => setShowNewOption(true)}
              color='cyan'
              variant='light'>
              Add Option
            </Button>
            <Tooltip label={`Delete ${title}`}>
              <Button
                leftIcon={<Trash size={20} />}
                color='red'
                variant='outline'
                onClick={() => handleDelete()}>
                Delete
              </Button>
            </Tooltip>
          </>
        )}
      </Group>
      <Card component='form' onSubmit={form.onSubmit(handleElectionSubmit)}>
        <Accordion
          // initialState={{ total: 1, initial: 1 }}
          initialItem={0}
          iconPosition='right'
          styles={{ item: { borderBottom: 'none' } }}>
          <Accordion.Item label='Election Details'>
            <Collapse in={Boolean(errorMessage)} my={8}>
              <Alert
                icon={<AlertCircle size={16} />}
                color='red'
                withCloseButton>
                <Grid>
                  <Grid.Col span={11}>
                    <Text color='red' size='sm' style={{ flexGrow: 2 }}>
                      {errorMessage}
                    </Text>
                  </Grid.Col>
                  <Grid.Col span={1}>
                    <ActionIcon
                      ml='auto'
                      variant='transparent'
                      color='red'
                      size='sm'
                      onClick={() => setErrorMessage('')}>
                      <X size={16} />
                    </ActionIcon>
                  </Grid.Col>
                </Grid>
              </Alert>
            </Collapse>

            <TextInput
              mt={4}
              disabled={loading}
              label='Title'
              {...form.getInputProps('title')}
            />
            <Textarea
              disabled={loading}
              mt={8}
              label='Description'
              minRows={3}
              {...form.getInputProps('description')}
            />
            <Button
              loading={loading}
              type='submit'
              color='cyan'
              variant='light'
              mt={16}
              ml='auto'>
              Sav{loading ? 'ing' : 'e'}
            </Button>
          </Accordion.Item>
        </Accordion>
      </Card>
      <OptionList />
      <NewQuestion
        open={showNewOption}
        onClose={() => setShowNewOption(false)}
      />
    </>
  );
};

EditElection.getLayout = withElectionLayout;

export default EditElection;
