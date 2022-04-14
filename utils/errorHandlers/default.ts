import { NotificationProps } from '@mantine/notifications';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import { Errors } from 'utils/constants';

interface loginErrorHandlerParameters {
  error: AxiosError;
  notificationObject?: NotificationProps;
  callback?: (message?: any) => void;
}

export const defaultHandler = (parameters: loginErrorHandlerParameters) => {
  const { error, callback } = parameters;
  const { response } = error;
  const { data, status } = response || {};
  const { errorMessage } = data as { errorMessage: string };

  switch (status) {
    case 400:
      if (callback && errorMessage) {
        callback(errorMessage);
      }
      break;
    case 401:
      if (callback) {
        callback(Errors.unauthorized);
      }
      break;
  }
};
