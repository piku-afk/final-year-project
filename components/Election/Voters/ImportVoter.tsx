import {
  Box,
  Card,
  Container,
  Group,
  MantineTheme,
  Text,
  useMantineTheme,
} from '@mantine/core';
import {
  Dropzone,
  DropzoneStatus,
  MS_EXCEL_MIME_TYPE,
} from '@mantine/dropzone';
import { showNotification, NotificationProps } from '@mantine/notifications';
import axios from 'axios';
import { useElectionStore } from 'context/ElectionStore';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import {
  FileSpreadsheet,
  Upload,
  X,
  Icon as TablerIcon,
  Check,
} from 'tabler-icons-react';
import { ApiEndpoints } from 'utils/constants';

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
    : theme.colorScheme === 'dark'
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <FileSpreadsheet {...props} />;
}

export const dropzoneChildren = (
  status: DropzoneStatus,
  theme: MantineTheme
) => (
  <Group
    position='center'
    spacing='md'
    style={{ minHeight: 160, pointerEvents: 'none' }}>
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={64}
    />

    <div>
      <Text size='lg' inline>
        Drag file here or click to select file
      </Text>
    </div>
  </Group>
);

export const ImportVoters = () => {
  const theme = useMantineTheme();
  const {
    state: {
      election: { id },
    },
  } = useElectionStore();
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);

  const handleDrop = async (files: File[]) => {
    const file = files[0];
    const notificationObject: NotificationProps = {
      message: 'Something went wrong. User List not uploaded.',
      color: 'red',
      icon: <X size={18} />,
    };
    const body = new FormData();
    body.append('file', file);
    setLoading(true);

    try {
      const { data } = await axios({
        url: `${ApiEndpoints.election}/${id}/addvoters`,
        method: 'POST',
        headers: {
          // @ts-ignore
          'Content-Type': `multipart/form-data; boundary=${body._boundary}`,
        },
        data: body,
      });
      const { message } = data;
      if (message === 'success') {
        notificationObject.message = 'User List added successfully';
        notificationObject.color = 'green';
        notificationObject.icon = <Check size={18} />;
        await mutate(`${ApiEndpoints.election}/${id}/voters`);
      }
    } catch (error) {}
    showNotification(notificationObject);
    setLoading(false);
  };

  return (
    <Card component={Container} size='xs'>
      <Text size='xl' weight={600} mb={16} align='center'>
        Add Voters
      </Text>

      <Box className='text-center'>
        <Text>
          You can import a list of voters in an excel file
          <Text component='span' color='cyan'>
            (.xlsx file)
          </Text>
          .
        </Text>
        <Text>
          The file should have two only columns:{' '}
          <Text component='span' weight={600}>
            Name, Email
          </Text>
        </Text>

        <Dropzone
          mt={24}
          loading={loading}
          onDrop={handleDrop}
          onReject={(files) => {
            console.log(files);
            const file = files[0];
            const { errors } = file;
            const { code } = errors[0];

            showNotification({
              message: code.split('-').join(' '),
              color: 'red',
              icon: <X size={18} />,
              styles: { root: { textTransform: 'capitalize' } },
            });
          }}
          accept={MS_EXCEL_MIME_TYPE}>
          {(status) => dropzoneChildren(status, theme)}
        </Dropzone>
      </Box>
    </Card>
  );
};
