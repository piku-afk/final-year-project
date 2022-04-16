import { Button, Grid, Modal, Textarea, TextInput } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { FC } from 'react';
import { ZodValidators } from 'utils';
import { z } from 'zod';

interface NewQuestion {
  open: boolean;
  onClose: () => void;
}

const { title, description } = ZodValidators;
const dataSchema = z.object({ title, description });

export const NewQuestion: FC<NewQuestion> = (props) => {
  const { open, onClose } = props;
  const form = useForm({
    initialValues: {
      title: '',
      description: '',
    },
    schema: zodResolver(dataSchema),
  });

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const handleSubmit = (formData: typeof form.values) => {
    console.log(formData);
  };

  return (
    <Modal
      styles={{ title: { fontSize: 24, fontWeight: 600 } }}
      centered
      opened={open}
      onClose={handleClose}
      title='Create New Question'>
      {/* @ts-ignore */}
      <Grid component='form' onSubmit={form.onSubmit(handleSubmit)}>
        <Grid.Col>
          <TextInput required label='Title' {...form.getInputProps('title')} />
        </Grid.Col>
        <Grid.Col>
          <Textarea
            minRows={3}
            label='Description'
            {...form.getInputProps('description')}
          />
        </Grid.Col>
        <Grid.Col className='d-flex'>
          <Button type='submit' color='cyan' variant='light' ml='auto'>
            Create
          </Button>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};
