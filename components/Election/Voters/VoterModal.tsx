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
import { NotificationProps, showNotification } from '@mantine/notifications';
import { Voter } from '@prisma/client';
import axios from 'axios';
import { useElectionStore } from 'context/ElectionStore';
import { FC, useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import { AlertCircle, Check, X } from 'tabler-icons-react';
import { ZodValidators } from 'utils';
import { ApiEndpoints } from 'utils/constants';
import { loginErrorHandler } from 'utils/errorHandlers';
import { z } from 'zod';

interface NewQuestion {
  open: boolean;
  onClose: () => void;
  voter: Voter | null;
}

const { title, email } = ZodValidators;
const dataSchema = z.object({
  name: title,
  email,
});

export const VoterModal: FC<NewQuestion> = (props) => {
  const { onClose, open, voter } = props;
  const {
    state: {
      election: { id: electionId },
    },
  } = useElectionStore();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { mutate } = useSWRConfig();

  const { setValues, ...form } = useForm({
    initialValues: {
      name: '',
      email: '',
    },
    schema: zodResolver(dataSchema),
  });

  useEffect(() => {
    const { name = '', email = '' } = voter || {};
    setValues({ name, email });
  }, [setValues, voter]);

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const handleSubmit = async (formData: typeof form.values) => {
    const notificationObject: NotificationProps = {
      message: 'User details updated successfully',
      color: 'green',
      icon: <Check />,
    };
    setErrorMessage('');
    setLoading(true);
    const baseUrl = `${ApiEndpoints.election}/${electionId}`;
    try {
      const { data } = await axios({
        url: `${baseUrl}/voter/${voter?.id}`,
        method: 'PUT',
        data: formData,
      });
      await mutate(`${baseUrl}/voters`);

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
      title='Edit Voter'>
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
            disabled={loading}
            label='Name'
            {...form.getInputProps('name')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            type='email'
            disabled={loading}
            label='Email'
            {...form.getInputProps('email')}
          />
        </Grid.Col>
        <Grid.Col>
          <TextInput
            disabled
            label='Phone'
            // value={voter.phone}
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
            Sav{loading ? 'ing' : 'e'}
          </Button>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};
