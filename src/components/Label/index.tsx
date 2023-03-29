import React from 'react';

interface Props {
  primaryText: string;
  secondaryText: string;
}

export const Label: React.FC<Props> = ({ primaryText, secondaryText }) => {
  return (
    <>
      {primaryText} (
      <b>
        <i>{secondaryText}</i>
      </b>
      )
    </>
  );
};
