import objectSupport from 'dayjs/plugin/objectSupport';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import { useForm } from '@mantine/form';

dayjs.extend(utc);
dayjs.extend(objectSupport);

export interface FormData {
  title: string;
  description: String | null;
  startDate: Date | null;
  endDate: Date | null;
  startTime: Date | null;
  endTime: Date | null;
}

export const useNewElectionForm = () => {
  const form = useForm<FormData>({
    initialValues: {
      title: '',
      description: null,
      startTime: null,
      endTime: null,
      startDate: null,
      endDate: null,
    },
    validate: {
      title: (value) => {
        if (value.length < 3) return 'Title is too short (Min 3 characters)';
        return null;
      },
      description: (value) => {
        if (
          typeof value === 'string' &&
          value.length < 5 &&
          value.length != 0
        ) {
          return 'Description is too short(Min 5 characters)';
        }
        return null;
      },
      startDate: (value, values) => {
        const { startTime, endDate } = values;
        if (startTime && !value) return 'Select start date';
        if (endDate && !value) {
          return 'Select start date';
        }
        if (dayjs(value).isBefore(dayjs(), 'dates'))
          return 'Selected date is in the past';
        return null;
      },
      endDate: (value, values) => {
        const { endTime, startDate } = values;
        if (dayjs(value).isBefore(dayjs(), 'dates'))
          return 'Selected date is in the past';

        if (endTime && !value) return 'Select end date';
        if (startDate) {
          if (dayjs(value).isBefore(dayjs(startDate), 'dates')) {
            return 'End date is before start date';
          }
        }
        return null;
      },
    },
  });

  return { form };
};
