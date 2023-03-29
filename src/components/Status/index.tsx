import React from 'react';

interface Props {
  active?: boolean;
}

export const Status: React.FC<Props> = ({ active }) => {
  return <span className={`a-status a-status-${active ? 'active' : 'inactive'}`} />;
};

Status.defaultProps = {
  active: false,
};
