import { Dropdown, Menu, Row, Typography } from 'antd';
import React, { FunctionComponent } from 'react';

interface Props {
  menu?: any;
  title?: String;
  icon?: any;
  onChangeStatus: (value: number) => void;
}

const MenuComponent: FunctionComponent<Props> = (props: Props): JSX.Element => {
  const { menu, title, icon, onChangeStatus } = props;

  const rederSubMenu = (menu: any) => {
    return (
      <Menu>
        {menu.map((item, index) => (
          <Menu.Item onClick={() => onChangeStatus(item.value)} key={index}>
            {item.name}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <Dropdown overlay={rederSubMenu(menu)} trigger={['click']}>
      <Row align='middle'>
        <Typography.Text style={{ marginRight: '10', marginBottom: 0 }}>{title}</Typography.Text>
        {icon}
      </Row>
    </Dropdown>
  );
};

export default MenuComponent;
