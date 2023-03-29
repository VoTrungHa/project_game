import { GiftTwoTone } from '@ant-design/icons';
import { Avatar, Card, Checkbox, Typography } from 'antd';
import React from 'react';

interface Props {
  id: string;
  title: string;
  amount: string;
  currency: string;
  onChange?: (value: boolean) => void;
}

export const CardCampaign: React.FC<Props> = ({ title, amount, currency, onChange }) => {
  return (
    <Card style={{ height: '100%', borderRadius: '10px', border: '1px solid rgba(15, 36, 71, 0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar size={32} style={{ flex: '0 0 auto', marginRight: '15px' }} />
        <div style={{ width: '100%' }}>
          <Typography.Title level={5}>{title}</Typography.Title>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <div>
              <GiftTwoTone style={{ fontSize: '20px', marginRight: '5px' }} twoToneColor='#D0008F' />
              <Typography.Text strong>
                {amount} <span style={{ color: '#D0008F' }}>{currency}</span>
              </Typography.Text>
            </div>
            <div>
              <Checkbox onChange={(e) => onChange && onChange(e.target.checked)} />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
