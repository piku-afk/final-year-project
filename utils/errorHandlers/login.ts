import { NotificationProps } from '@mantine/notifications';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import { Errors } from 'utils/constants';

interface loginErrorHandlerParameters {
  error: AxiosError;
  notificationObject?: NotificationProps;
  callback?: (message?: any) => void;
}

export const loginErrorHandler = (parameters: loginErrorHandlerParameters) => {
  const { error, callback } = parameters;
  const { response } = error;
  const { data, status } = response || {};
  console.log(data);

  switch (status) {
    case 400:
      const { issues = [] } = (data as { issues: any[] }) || {};
      const { message = '' } = (issues[0] as { message: string }) || {};
      if (callback && message) {
        callback(message);
      }
      break;
    case 401:
      if (callback) {
        callback(Errors.unauthorized);
      }
      break;
  }
};
