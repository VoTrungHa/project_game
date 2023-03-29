import Layout from 'antd/lib/layout/layout';
import Header from 'containers/Header';
import SideBar from 'containers/SideBar';
import useResize from 'hooks/useResize';
import React, { ReactNode, useEffect, useState } from 'react';
import { useStyles } from './styles';

interface Props {
  children: ReactNode;
}

export default function MainLayout(props: Props) {
  const { children } = props;
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);

  const size = useResize();

  const onToggle = () => setCollapsed(!collapsed);

  useEffect(() => {
    if (size[0] < 768) {
      return setCollapsed(true);
    }
    return setCollapsed(false);
  }, [size]);

  return (
    <Layout className={classes.layout}>
      <SideBar collapsed={collapsed} />
      <Layout>
        <Header onToggle={onToggle} collapsed={collapsed} />
        <div className={classes.content} style={{ marginLeft: collapsed ? '80px' : '300px' }}>
          {children}
        </div>
      </Layout>
    </Layout>
  );
}
