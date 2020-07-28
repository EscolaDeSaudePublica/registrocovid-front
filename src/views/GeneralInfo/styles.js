import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4),
  },
  header: {
    display: 'flex',
    flexDirection: 'column'
  },
  titleWrapper: {
    display: 'flex',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonSave: {
    width: '258px',
    height: '48px',
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    flex: 'auto',
    flexDirection: 'column',

  },
  textField: {
    marginTop: theme.spacing(2),
  },
}));

export default useStyles;
