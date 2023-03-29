import { COLOR } from 'constants/colors';
import { createUseStyles } from 'react-jss';

export const useStyles = createUseStyles({
  header: {
    backgroundColor: '#fff',
    padding: '20px',
  },
  itemMenu: {
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    '&:hover': {
      color: 'blue',
    },
  },
  textMenu: {
    width: 100,
    paddingLeft: 10,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
  },
  logo: {
    maxHeight: 32,
    display: 'block',
    padding: '3px',
    objectFit: 'cover',
    margin: 'auto',
    maxWidth: '100%',
    paddingLeft: 28,
  },
  user: {
    padding: '10px',
  },
  infoUser: {
    '&.ant-typography': {
      display: 'block',
      paddingLeft: '10px',
      color: COLOR.white,
    },
  },
  avatar: {
    padding: 5,
  },
});
