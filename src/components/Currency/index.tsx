import { Avatar } from 'antd';
import React from 'react';

interface Props {
  icon: string;
  amount: string | number;
  color?: string;
  bold?: boolean;
}

export const Currency: React.FC<Props> = ({ icon, amount, color, bold }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
      <Avatar
        src={icon}
        style={{ marginRight: '5px', flex: '0 0 1', width: '30px', height: '30px' }}
        className='avatar'
      />
      <span style={{ fontWeight: bold ? 'bold' : 'initial', color }} className='amount'>
        {amount}
      </span>
    </div>
  );
};
