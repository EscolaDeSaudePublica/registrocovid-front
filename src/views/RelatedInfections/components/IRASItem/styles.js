import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  heading: {
    display: 'flex',
    alignItems: 'center'
  },
  headingLabel: {
    marginRight: theme.spacing(1),
  },
  accordionDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  field: {
    marginTop: theme.spacing(1),
  },
  fieldDescricao: {
    marginBottom: theme.spacing(1),
  }
}));

export default useStyles;
