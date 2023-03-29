import { Input, Typography } from 'antd';
import React from 'react';
import NumberFormat, { NumberFormatProps } from 'react-number-format';

interface Props extends NumberFormatProps {
  isRemoveLeadingZero?: boolean;
  isUnit?: string;
  isPassword?: boolean;
}

export const InputNumber: React.FC<Props> = ({ isRemoveLeadingZero, value, isUnit, isPassword, ...props }) => {
  return (
    <>
      <NumberFormat
        {...props}
        className={!isPassword ? 'ant-input' : undefined}
        value={isRemoveLeadingZero ? String(value).replace(/^0+/gi, '') : value}
        customInput={isPassword ? Input.Password : undefined}
      />
      {isUnit && (
        <Typography.Text type='secondary' strong style={{ fontStyle: 'italic' }}>
          {isUnit}
        </Typography.Text>
      )}
    </>
  );
};

InputNumber.defaultProps = {
  isRemoveLeadingZero: false,
  isPassword: false,
};
