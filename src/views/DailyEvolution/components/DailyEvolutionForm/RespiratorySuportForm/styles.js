import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    maxWidth: '864px',
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  title: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

export default useStyles;

