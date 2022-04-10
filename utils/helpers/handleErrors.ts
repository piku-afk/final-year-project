import { NotificationProps } from '@mantine/notifications';
import { Errors } from 'utils/constants';

export const handleLoginError = (
  error: unknown,
  notificationObject: NotificationProps
) => {
  console.error(error);
  const { code, message } = error as { code: number; message: string };
  notificationObject.message =
    'Something went wrong. Please try again or maybe check your current account in MetaMask.';

  if (code === 4001) {
    notificationObject.message =
      'You will need to connect to MetaMask in order to continue.';
  } else if (code === -32603) {
    notificationObject.message =
      'You already have an account. Consider signing in with the current MetaMask account.';
  } else if (code === +Errors.failedLogin.code) {
    notificationObject.message = Errors.failedLogin.message;
    // 'Selected MetaMask account is incorrect. Please change the account and try again.';
  }
};
