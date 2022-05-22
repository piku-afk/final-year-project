import { Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { NotificationProps, showNotification } from '@mantine/notifications';
import { Voter } from '@prisma/client';
import axios from 'axios';
import { useElectionStore } from 'context/ElectionStore';
import { useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { Check } from 'tabler-icons-react';
import { ApiEndpoints } from 'utils/constants';

export const useDeleteAllVoters = () => {
  const {
    state: {
      election: { id: electionId, title },
    },
  } = useElectionStore();
  const modals = useModals();
  const { mutate } = useSWRConfig();

  const handleDelete = useCallback(() => {
    modals.openConfirmModal({
      title: 'Delete election',
      centered: true,
      children: (
        <Text size='sm'>
          Are you sure you want to delete all voters for the election{' '}
          <strong>{title}</strong>? This action is destructive and all the saved
          users will be deleted.
        </Text>
      ),
      styles: { title: { fontSize: 20 } },
      labels: { confirm: 'Delete all users', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        if (!electionId) return;
        const notificationObject: NotificationProps = {
          message:
            'Something went wrong, delete unsuccessful. Please try again later.',
          color: 'red',
        };
        const url = `${ApiEndpoints.election}/${electionId}/voters`;
        try {
          await axios.delete(url);
          notificationObject.message = `User list deleted successfully`;
          notificationObject.color = 'green';
          notificationObject.icon = <Check />;
        } catch (error) {
          console.log(error);
        }

        showNotification(notificationObject);
        await mutate(url);
        return;
      },
    });
  }, [modals, electionId, title, mutate]);

  return handleDelete;
};

export const useDeleteVoter = () => {
  const {
    state: {
      election: { id: electionId },
    },
  } = useElectionStore();
  const { mutate } = useSWRConfig();

  const handleDelete = useCallback(
    async (voter: Voter) => {
      const { id: voterId, name } = voter;
      const notificationObject: NotificationProps = {
        message:
          'Something went wrong, delete unsuccessful. Please try again later.',
        color: 'red',
      };

      const baseUrl = `${ApiEndpoints.election}/${electionId}`;

      try {
        await axios.delete(`${baseUrl}/voter/${voterId}`);

        notificationObject.message = `User ${name} deleted successfully`;
        notificationObject.color = 'green';
        notificationObject.icon = <Check />;
      } catch (error) {
        console.log(error);
      }

      showNotification(notificationObject);
      await mutate(`${baseUrl}/voters`);
      return;
    },
    [electionId, mutate]
  );

  return handleDelete;
};
