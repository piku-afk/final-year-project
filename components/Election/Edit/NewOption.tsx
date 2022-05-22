import {
  ActionIcon,
  Alert,
  Button,
  Collapse,
  Grid,
  Modal,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import axios from 'axios';
import { useElectionStore } from 'context/ElectionStore';
import { FC, useEffect, useState } from 'react';
import { ZodValidators } from 'utils';
import { ApiEndpoints } from 'utils/constants';
import { z } from 'zod';
import { showNotification, NotificationProps } from '@mantine/notifications';
import { AlertCircle, Check, X } from 'tabler-icons-react';
import { loginErrorHandler } from 'utils/errorHandlers';
import { useSWRConfig } from 'swr';
import { ElectionOption } from '@prisma/client';

interface NewQuestion {
  open: boolean;
  onClose: () => void;
  option?: ElectionOption;
}

const { title, description, makeOptionalString } = ZodValidators;
const dataSchema = z.object({
  title,
  description: makeOptionalString(description),
});

export const NewQuestion: FC<NewQuestion> = (props) => {
  const { open, onClose, option } = props;
  const {
    state: {
      election: { id },
    },
  } = useElectionStore();
  const {
    id: optionId,
    title: optionTitle,
    description: optionDescription,
  } = option || {};
  const { setValues, ...form } = useForm({
    initialValues: {
      title: '',
      description: '',
    },
    schema: zodResolver(dataSchema),
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { mutate } = useSWRConfig();

  useEffect(() => {
    setValues({
      title: optionTitle || '',
      description: optionDescription || '',
    });
  }, [setValues, optionTitle, optionDescription]);

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const handleSubmit = async (formData: typeof form.values) => {
    const notificationObject: NotificationProps = {
      message: 'Election details updated successfully',
      color: 'green',
      icon: <Check />,
    };
    setErrorMessage('');
    setLoading(true);
    const url = optionId
      ? `${ApiEndpoints.election}/${id}/option/${optionId}`
      : `${ApiEndpoints.election}/${id}/newoption`;

    try {
      const { data } = await axios({
        url,
        method: optionId ? 'PUT' : 'POST',
        data: formData,
      });
      await mutate(`${ApiEndpoints.election}/${id}/options`);

      if (data.id) {
        showNotification(notificationObject);
        handleClose();
      }
    } catch (error: any) {
      loginErrorHandler({ error, callback: setErrorMessage });
    }
    setLoading(false);
  };

  return (
    <Modal
      styles={{ title: { fontSize: 24, fontWeight: 600 } }}
      centered
      opened={open}
      onClose={handleClose}
      title={optionId ? 'Edit Option' : `Add New Option`}>
      {/* @ts-ignore */}
      <Grid component='form' onSubmit={form.onSubmit(handleSubmit)}>
        {Boolean(errorMessage) && (
          <Grid.Col>
            <Collapse in={Boolean(errorMessage)} my={8}>
              <Alert
                icon={<AlertCircle size={16} />}
                color='red'
                withCloseButton>
                <Grid gutter={0}>
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
          </Grid.Col>
        )}
        <Grid.Col>
          <TextInput
            required
            disabled={loading}
            label='Title'
            {...form.getInputProps('title')}
          />
        </Grid.Col>
        <Grid.Col>
          <Textarea
            disabled={loading}
            minRows={3}
            label='Description'
            {...form.getInputProps('description')}
          />
        </Grid.Col>
        <Grid.Col className='d-flex justify-content-end'>
          <Button
            onClick={handleClose}
            type='button'
            variant='outline'
            color='gray'>
            Cancel
          </Button>
          <Button
            ml={16}
            loading={loading}
            type='submit'
            color='cyan'
            variant='light'>
            {optionId
              ? 'Sav' + (loading ? 'ing' : 'e')
              : 'Creat' + (loading ? 'ing' : 'e')}
          </Button>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};
