import { Avatar, Col, Row, Typography } from 'antd';
import React from 'react';

interface Props {
  avatar?: string;
  name: string;
  tags?: React.ReactNode;
  extra?: React.ReactNode;
  children?: React.ReactNode;
}

export const PageHeaderCustom: React.FC<Props> = ({ avatar, name, tags, extra, children }) => {
  return (
    <>
      <section style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
          {avatar && <Avatar size={70} src={avatar} style={{ marginRight: '5px', marginBottom: '1px' }} />}
          <Typography.Title level={4} style={{ marginRight: '10px', marginBottom: '1px' }}>
            {name}
          </Typography.Title>
          <div style={{ marginBottom: '1px' }}>{tags}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>{extra}</div>
      </section>
      <Row style={{ padding: '24px' }}>
        <Col span={24}>{children}</Col>
      </Row>
    </>
  );
};
