import React from 'react';

interface Props {
  text: string | React.ReactNode;
  onClick: () => void;
  type?: 'danger' | 'success' | 'normal';
}

export const Textlink: React.FC<Props> = ({ text, onClick, type }) => {
  return (
    <a className={`a-textlink a-textlink-${type}`} onClick={onClick}>
      {text}
    </a>
  );
};
