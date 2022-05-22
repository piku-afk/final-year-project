import {
  ActionIcon,
  Card,
  Group,
  Skeleton,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { Voter } from '@prisma/client';
import { useDeleteAllVoters, useDeleteVoter } from 'hooks';
import { FC, useState } from 'react';

import { Pencil, Trash } from 'tabler-icons-react';
import { VoterModal } from './VoterModal';

export const VoterListSkeleton = () => {
  return (
    <Card>
      <Skeleton height={24} radius='md' width={200} mb={16} />
      <Table mt={16}>
        <tbody>
          {Array.from(Array(5).keys()).map((item) => (
            <tr key={item}>
              {Array.from(Array(4).keys()).map((item) => (
                <td key={item}>
                  <Skeleton my={4} height={12} radius='md' />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

interface VoterListProps {
  data: Voter[];
}

export const VotersList: FC<VoterListProps> = (props) => {
  const { data } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedVoter, setSelectedVoter] = useState<Voter | null>(null);

  const handleDeleteAll = useDeleteAllVoters();
  const handleDeleteVoter = useDeleteVoter();

  return (
    <Card>
      <Group mb={16} position='apart' px={8}>
        <Text size='xl' weight={600}>
          Voters List
        </Text>
        <Tooltip label='Delete all users'>
          <ActionIcon color='red' variant='light' onClick={handleDeleteAll}>
            <Trash size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
      <Table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((voter) => {
            const { email, id, name } = voter;
            return (
              <tr key={id}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{email}</td>
                <td align='right'>
                  <Tooltip label={`Edit ${name}`}>
                    <ActionIcon
                      size='md'
                      color='cyan'
                      variant='light'
                      onClick={() => {
                        setSelectedVoter(voter);
                        setShowModal(true);
                      }}>
                      <Pencil size={18} />
                    </ActionIcon>
                  </Tooltip>
                  <Tooltip label={`Delete ${name}`} ml={8}>
                    <ActionIcon
                      size='md'
                      color='red'
                      variant='light'
                      onClick={() => handleDeleteVoter(voter)}>
                      <Trash size={18} />
                    </ActionIcon>
                  </Tooltip>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <VoterModal
        open={showModal}
        onClose={() => {
          setSelectedVoter(null);
          setShowModal(false);
        }}
        voter={selectedVoter}
      />
    </Card>
  );
};
