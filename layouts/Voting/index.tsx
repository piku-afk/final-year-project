import { ElectionStore } from 'context/ElectionStore';
import { FC, PropsWithChildren } from 'react';

export const VotingLayout: FC<PropsWithChildren<{}>> = (props) => {
  const { children } = props;

  return <ElectionStore>{children}</ElectionStore>;
};
