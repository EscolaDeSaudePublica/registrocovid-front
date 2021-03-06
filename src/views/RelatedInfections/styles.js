import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4),
  },
  formWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
  },
  titleWrapper: {
    display: 'flex',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionSection: {
    display: 'flex',
  },
  buttonSave: {
    width: '200px',
    height: '48px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentItem: {
    maxWidth: '864px',
  },
}));

export default useStyles;
