import React from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';

export interface Props extends RouterLinkProps {
  useNative?: boolean;
  to: string;
  state?: unknown;
}

export const Link: React.FC<Props> = ({ to: pathname, useNative, innerRef, children, state, ...otherProps }) => {
  if (useNative) {
    return (
      <a href={pathname} ref={innerRef} {...otherProps}>
        {children}
      </a>
    );
  }
  return (
    <RouterLink
      to={{
        pathname,
        state,
      }}
      {...otherProps}>
      {children}
    </RouterLink>
  );
};
