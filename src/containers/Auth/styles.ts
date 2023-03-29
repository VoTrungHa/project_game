import { bgLoginLeft, bgLoginRight } from 'assets/images';
import { COLOR } from 'constants/colors';
import responsive from 'constants/responsive';
import { createUseStyles } from 'react-jss';
const { maxMobile } = responsive;

export const useStyles = createUseStyles({
  backgroundRight: {
    height: '100vh',
    backgroundImage: `url(${bgLoginRight})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    [maxMobile]: {
      height: '100vh',
    },
  },
  backgroundLeft: {
    height: '100vh',
    width: '100%',
    backgroundImage: `url(${bgLoginLeft})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    [maxMobile]: {
      width: '100%',
      height: '0vh',
      backgroundPosition: 'top',
    },
  },
  title: {
    color: COLOR.title,
    fontSize: 30,
    fontWeight: 600,
    [maxMobile]: {
      marginBottom: 45,
      fontSize: 18,
    },
  },
  forgetPassword: {
    margin: '90px 0',
    textAlign: 'center',
    color: COLOR.primary,
    fontWWeight: 600,
    [maxMobile]: {
      marginTop: 45,
    },
  },
  footer: {
    color: '#555555',
    textAlign: 'center',
    margin: '40px 0 0 0',
    [maxMobile]: {
      margin: 0,
    },
  },
  buttonSubmit: {
    width: '100%',
    fontWeight: 600,
    fontSize: 16,
    borderRadius: 10,
    background: COLOR.primary,
    borderColor: COLOR.primary,
  },
  itemRight: {
    height: '100%',
  },
  select: {
    position: 'absolute',
    top: 0,
    right: 5,
  },
});
