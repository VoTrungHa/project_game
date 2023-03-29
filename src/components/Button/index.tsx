import { Button, ButtonProps } from 'antd';
import React from 'react';

interface Props extends ButtonProps {
  type?: any;
  name: string;
  htmlType?: any;
  styles?: any;
  disabled?: boolean;
}
const ButtonComponent: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  const { type, name, htmlType, styles, disabled } = props;
  return (
    <Button {...props} type={type} htmlType={htmlType} className={styles} disabled={disabled}>
      {name}
    </Button>
  );
};

export default ButtonComponent;
