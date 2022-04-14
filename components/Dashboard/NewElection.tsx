import { Button, Grid, Group, Modal, Textarea, TextInput } from '@mantine/core';
import { DatePicker, TimeInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { FC, useState } from 'react';
import { Calendar, Check, Clock } from 'tabler-icons-react';

import { showNotification, NotificationProps } from '@mantine/notifications';
import { User } from '@prisma/client';
import axios from 'axios';
import { useNewElectionForm } from './useNewElectionForm';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useSWRConfig } from 'swr';
dayjs.extend(customParseFormat);

interface NewElection {
  user?: User;
  open: boolean;
  onClose: () => void;
}

const formatDate = (inputDate: Date | null, inputTime: Date | null) => {
  const [date, month, year] = dayjs(inputDate)
    .format('DD/MM/YYYY')
    .split('/')
    .map((item) => +item);

  if (inputTime) {
    const [hours, minutes] = dayjs(inputTime)
      .format('HH-mm')
      .split('-')
      .map((item) => +item);
    // @ts-ignore
    // prettier-ignore
    return dayjs.utc({ y: year, M: month - 1, d: date, h: hours, m: minutes });
  }
  // @ts-ignore
  return dayjs.utc({ y: year, M: month - 1, d: date });
};

export const NewElection: FC<NewElection> = (props) => {
  const { open, onClose } = props;
  const [loading, setLoading] = useState(false);
  const { form } = useNewElectionForm();
  const { mutate } = useSWRConfig();

  const handleClose = () => {
    onClose();
    form.reset();
  };

  const handleSubmit = async (formData: typeof form.values) => {
    const { endDate, endTime, startDate, startTime, ...restFormData } =
      formData;
    let start = null;
    let end = null;

    if (startDate) {
      start = formatDate(startDate, startTime);
    }
    if (endDate) {
      end = formatDate(endDate, endTime);
    }
    const body = {
      ...restFormData,
      ...(start && { start }),
      ...(end && { end: end.toDate() }),
    };

    const notificationObject: NotificationProps = {
      message: 'Something went wrong. New election not created',
      color: 'red',
    };
    setLoading(true);
    try {
      const { data } = await axios({
        url: '/api/election/create',
        method: 'POST',
        data: body,
      });
      const { message, id } = data as { message: string; id: number };
      if (id) {
        console.log(message);
        notificationObject.message = 'New election successfully created';
        notificationObject.color = 'green';
        notificationObject.icon = <Check />;
        handleClose();
        mutate('/api/election');
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
    showNotification(notificationObject);
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
        onSubmit={form.onSubmit(handleSubmit)}>
        <Grid.Col>
          <TextInput
            disabled={loading}
            required
            label='Title'
            placeholder='e.g. Board of Directors'
            {...form.getInputProps('title')}
          />
        </Grid.Col>
        <Grid.Col>
          <Textarea
            disabled={loading}
            placeholder='A short description'
            label='Description'
            minRows={3}
            {...form.getInputProps('description')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DatePicker
            disabled={loading}
            label='Start Date'
            // description='Duration for election to take place'
            allowFreeInput
            inputFormat='DD/MM/YYYY'
            placeholder='Pick Date'
            icon={<Calendar size={16} />}
            {...form.getInputProps('startDate')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TimeInput
            disabled={loading}
            clearable
            label='Start Time'
            // description='24 hours format'
            icon={<Clock size={16} />}
            {...form.getInputProps('startTime')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <DatePicker
            disabled={loading}
            label='End Date'
            allowFreeInput
            inputFormat='DD/MM/YYYY'
            // description='Duration for election to take place'
            placeholder='Pick Date'
            icon={<Calendar size={16} />}
            {...form.getInputProps('endDate')}
          />
        </Grid.Col>
        <Grid.Col span={6}>
          <TimeInput
            disabled={loading}
            clearable
            label='End Time'
            // description='The time when to end the election on the end date in 24 hours format'
            icon={<Clock size={16} />}
            {...form.getInputProps('endTime')}
          />
        </Grid.Col>
        {/* @ts-ignore */}
        <Grid.Col component={Group} position='right'>
          <Button
            disabled={loading}
            type='button'
            color='red'
            variant='subtle'
            onClick={handleClose}>
            Cancel
          </Button>
          <Button
            disabled={loading}
            loading={loading}
            type='submit'
            color='cyan'
            variant='light'>
            Submit
          </Button>
        </Grid.Col>
      </Grid>
    </Modal>
  );
};
