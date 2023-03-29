import { DeleteOutlined } from '@ant-design/icons';
import { Avatar, Card, Switch, Typography } from 'antd';
import React from 'react';

interface Props {
  id: string;
  title: string;
  src: string;
  onChange?: (value: boolean) => void;
}

export const CardToken: React.FC<Props> = ({ title, src }) => {
  return (
    <Card style={{ borderRadius: '10px', border: '1px solid rgba(15, 36, 71, 0.15)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar src={src} size={32} style={{ flex: '0 0 auto', marginRight: '15px' }} />
          <Typography.Title level={5}>{title}</Typography.Title>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Switch style={{ marginRight: '10px' }} />
          <DeleteOutlined style={{ fontSize: '20px' }} />
        </div>
      </div>
    </Card>
  );
};
