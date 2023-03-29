import { createUseStyles } from 'react-jss';

const style = {
  layout: {
    height: '100%',
  },
  content: {
    padding: '10px',
    background: '#f0f2f5',
  },
};
export const useStyles = createUseStyles(style);
