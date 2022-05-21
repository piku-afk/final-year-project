import { Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { NotificationProps, showNotification } from '@mantine/notifications';
import { Election } from '@prisma/client';
import axios from 'axios';
import { useGlobalStore } from 'context/GlobalStore';
import { useRouter } from 'next/router';
import { useCallback } from 'react';
import { KeyedMutator, useSWRConfig } from 'swr';
import { Check } from 'tabler-icons-react';
import { ApiEndpoints } from 'utils/constants';

export const useDeleteElection = (
  electionId: number | undefined,
  title: string | undefined
) => {
  const {
    state: {
      currentUser: { id: userId },
    },
  } = useGlobalStore();
  const modals = useModals();
  const { push } = useRouter();

  const handleDelete = useCallback(
    (mutate: KeyedMutator<Election[]> | null = null) => {
      modals.openConfirmModal({
        title: 'Delete election',
        centered: true,
        children: (
          <Text size='sm'>
            Are you sure you want to delete election <strong>{title}</strong>?
            This action is destructive and all the saved options will also be
            deleted.
          </Text>
        ),
        styles: { title: { fontSize: 20 } },
        labels: { confirm: 'Delete election', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          if (!electionId) return;
          const notificationObject: NotificationProps = {
            message:
              'Something went wrong, delete unsuccessful. Please try again later.',
            color: 'red',
          };
          try {
            await axios.delete(`${ApiEndpoints.election}/${electionId}`);
            notificationObject.message = `Election: ${title} deleted successfully`;
            notificationObject.color = 'green';
            notificationObject.icon = <Check />;
          } catch (error) {
            console.log(error);
          }

          showNotification(notificationObject);
          if (mutate) {
            await mutate();
            return;
          }

          await push(userId ? `/${userId}/dashboard` : '/');
        },
      });
    },
    [modals, electionId, title, userId, push]
  );

  return handleDelete;
};

export const useDeleteQuestion = () => {
  const modals = useModals();
  const { query } = useRouter();
  const { electionId } = query;
  type props = {
    mutate?: KeyedMutator<any>;
    title: string;
    questionId: string | number;
  };
  const handleDelete = useCallback(
    ({ mutate, questionId, title }: props) => {
      modals.openConfirmModal({
        title: 'Delete Question',
        centered: true,
        children: (
          <Text size='sm'>
            Are you sure you want to delete question <strong>{title}</strong>?
            This action is destructive and all the saved options will also be
            deleted.
          </Text>
        ),
        styles: { title: { fontSize: 20 } },
        labels: { confirm: 'Delete question', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          if (!electionId) return;
          const notificationObject: NotificationProps = {
            message:
              'Something went wrong, delete unsuccessful. Please try again later.',
            color: 'red',
          };
          try {
            await axios.delete(
              `${ApiEndpoints.election}/${electionId}/question/${questionId}`
            );
            notificationObject.message = 'Question deleted successfully';
            notificationObject.color = 'green';
            notificationObject.icon = <Check />;
          } catch (error) {
            console.log(error);
          }
          showNotification(notificationObject);
          if (mutate) {
            await mutate();
            return;
          }
        },
      });
    },
    [modals, electionId]
  );

  return handleDelete;
};

export const useDeleteOption = () => {
  const modals = useModals();
  const { query } = useRouter();
  const { electionId } = query;

  type props = {
    mutate?: KeyedMutator<any>;
    title: string;
    optionId: string | number;
  };

  const handleDelete = useCallback(
    ({ mutate, optionId, title }: props) => {
      modals.openConfirmModal({
        title: 'Delete Option',
        centered: true,
        children: (
          <Text size='sm'>
            Are you sure you want to delete option <strong>{title}</strong>?
            This action is destructive and irreversible.
          </Text>
        ),
        styles: { title: { fontSize: 20 } },
        labels: { confirm: 'Delete option', cancel: 'Cancel' },
        confirmProps: { color: 'red' },
        onConfirm: async () => {
          if (!electionId) return;
          const notificationObject: NotificationProps = {
            message:
              'Something went wrong, option deletion unsuccessful. Please try again later.',
            color: 'red',
          };
          try {
            await axios.delete(
              `${ApiEndpoints.election}/${electionId}/option/${optionId}`
            );
            notificationObject.message = 'Option deleted successfully';
            notificationObject.color = 'green';
            notificationObject.icon = <Check />;
          } catch (error) {
            console.log(error);
          }
          showNotification(notificationObject);
          if (mutate) {
            await mutate();
            return;
          }
        },
      });
    },
    [modals, electionId]
  );

  return handleDelete;
};
