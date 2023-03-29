import { Button, Modal } from 'antd';
import React, { FunctionComponent, useState } from 'react';

interface Props {}

const ErrorMessage: FunctionComponent<Props> = (): JSX.Element => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleClose = () => {
    setIsModalVisible(false);
  };
  return (
    <Modal
      width={320}
      title={'title'}
      visible={isModalVisible}
      onCancel={handleClose}
      footer={[
        <Button key='close' onClick={handleClose}>
          OK
        </Button>,
      ]}>
      <p>Some contents...</p>
    </Modal>
  );
};

export default ErrorMessage;
