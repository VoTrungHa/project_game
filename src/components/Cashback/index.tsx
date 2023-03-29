import { EditOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
  id: number;
  name: string;
  cashbackRate: number;
  onClick: (id: number) => void;
}

export const Cashback: React.FC<Props> = ({ id, name, cashbackRate, onClick }) => {
  return (
    <div className='cashback_wrapper'>
      <span>{name}</span>
      <br />
      <span>Cashback: {cashbackRate}%</span>
      <EditOutlined onClick={() => onClick(id)} />
    </div>
  );
};
