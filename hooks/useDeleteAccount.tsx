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
  const { mutate } = useSWRConfig();

  const handleDelete = useCallback(
    (mutate: KeyedMutator<Election[]> | null = null) => {
      modals.openConfirmModal({
        title: 'Delete election',
        centered: true,
        children: (
          <Text size='sm'>
            Are you sure you want to delete election <strong>{title}</strong>?
            This action is destructive and you will have to contact support to
            restore your data.
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
