import { Input } from 'antd';
import React from 'react';

interface Props {
  type?: string;
  prefix?: any;
  placeholder?: string;
  bordered: boolean;
}

const InputComponent: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  const { type, prefix, placeholder, bordered } = props;
  switch (type) {
    case 'password':
      return <Input.Password {...props} prefix={prefix} placeholder={placeholder} bordered={bordered} />;
    default:
      return <Input {...props} prefix={prefix} placeholder={placeholder} bordered={bordered} />;
  }
};

export default InputComponent;
