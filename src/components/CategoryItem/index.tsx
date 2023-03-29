import { EditOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
  id: number;
  text: string;
  active?: boolean;
  onActive: (id: number) => void;
}

export const CategoryItem: React.FC<Props> = ({ id, text, active = false, onActive }) => {
  return (
    <div className='categoryitem_wrapper'>
      <span onClick={() => onActive(id)} className={`categoryitem ${active && 'categoryitem-active'}`}>
        {text}
      </span>
      <EditOutlined />
    </div>
  );
};
