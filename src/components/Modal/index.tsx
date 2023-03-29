import { Modal as ModalAntd, ModalProps } from 'antd';
import React from 'react';

interface Props extends ModalProps {}

export const Modal: React.FC<Props> = ({ children, ...rest }) => {
  return <ModalAntd {...rest}>{children}</ModalAntd>;
};
