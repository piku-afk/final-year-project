import { Button, Grid, Group, Modal, TextInput } from '@mantine/core';
import { DateRangePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { FC } from 'react';

interface NewElection {
  open: boolean;
  onClose: () => void;
}

export const NewElection: FC<NewElection> = (props) => {
  const { open, onClose } = props;
  const form = useForm({
    initialValues: {
      title: '',
    },
    validate: {
      title: (value) => {
        if (value.length < 3) return 'Title is too short (Min 3 characters)';
        return null;
      },
    },
  });

  const handleClose = () => {
    onClose();
    form.reset();
  };

  return (
    <Modal
      styles={{ title: { fontSize: 24, fontWeight: 600 } }}
      centered
      opened={open}
      onClose={handleClose}
      title='Create New Election'>
      <Grid
        // @ts-ignore
        component='form'
        onSubmit={form.onSubmit((values) => console.log(values))}>
        <Grid.Col>
          <TextInput
            required
            label='Title'
            placeholder='e.g. Board of Directors'
            {...form.getInputProps('title')}
          />
        </Grid.Col>
        <Grid.Col>
          {/* <DateRangePicker
            label='Book hotel'
            placeholder='Pick dates range'
            value={value}
            onChange={setValue}
          /> */}
        </Grid.Col>
        {/* @ts-ignore */}
        <Grid.Col component={Group} position='right'>
          <Button
            type='button'
            color='red'
            variant='subtle'
            onClick={handleClose}>
            Cancel
          </Button>
          <Button type='submit' color='cyan' variant='light'>
            Submit
          </Button>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};
