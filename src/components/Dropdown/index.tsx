import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import React, { FunctionComponent } from 'react';

interface Props {
  menu?: any;
  button?: any;
}

const DropdownComponent: FunctionComponent<Props> = (props: Props): JSX.Element => {
  const { menu, button } = props;

  return (
    <Dropdown overlay={menu} trigger={['click']} placement='bottomRight'>
      {typeof button === 'string' ? (
        <Button>
          {button} <DownOutlined />
        </Button>
      ) : (
        button
      )}
    </Dropdown>
  );
};

DropdownComponent.defaultProps = {
  menu: <></>,
  button: 'Dropdown',
};

export default DropdownComponent;
