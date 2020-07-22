import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(4)
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
  actionsWrapper: {
    display: 'flex',
    alignItems: 'center',
  },
  fieldNumProntuario: {
    width: '362px',
    height: '48px',
    marginRight: theme.spacing(3),
  },
  buttonAddPatient: {
    width: '258px',
    height: '48px',
  }
}));

export default useStyles;