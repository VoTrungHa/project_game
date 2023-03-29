import { Col as ColAntd, ColProps as ColPropsAntd, Row as RowAntd, RowProps as RowPropsAntd } from 'antd';
import React from 'react';

export const Container: React.FC = (props) => {
  return <div>{props.children}</div>;
};

interface RowProps extends RowPropsAntd {
  fullHeight?: boolean;
}

export const Row: React.FC<RowProps> = ({ fullHeight, style, ...props }) => {
  return <RowAntd {...props} style={{ ...style, height: fullHeight ? '100vh' : 'auto' }} />;
};

interface ColProps extends ColPropsAntd {
  textAlign?: 'left' | 'center' | 'right';
}

export const Col: React.FC<ColProps> = ({ textAlign, ...rest }) => {
  return <ColAntd {...rest} style={{ textAlign }} />;
};
