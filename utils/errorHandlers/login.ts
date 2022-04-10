import { NotificationProps } from '@mantine/notifications';

interface Error {
  response: {
    data: { details: { body: [{ message: string }] }; message: string };
    status: 400 | 401;
  };
}

interface loginErrorHandlerParameters {
  error: Error;
  notificationObject?: NotificationProps;
  callback?: (message?: any) => void;
}

export const loginErrorHandler = (parameters: loginErrorHandlerParameters) => {
  const { error, callback } = parameters;

  const {
    response: {
      data: { details, message },
      status,
    },
  } = error;

  switch (status) {
    case 400:
      const { body = [] } = details || {};
      let errorMessage = '';
      if (body.length > 0) {
        const { message = '' } = body[0] || {};
        errorMessage = message;
      } else if (message) {
        errorMessage = message;
      }
      if (errorMessage && callback) {
        callback(errorMessage);
      }
      break;
    case 401:
      if (callback) {
        callback();
      }
      break;
  }
};
