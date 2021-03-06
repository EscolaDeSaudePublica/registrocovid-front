import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    marginTop: theme.spacing(2),
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  formWraper: {
    display: 'flex',
  },
  fieldWraper: {
    marginTop: theme.spacing(1),
  },
  tipo_iras_descricao: {
    maxWidth: '228px',
  },
  field: {
    marginTop: theme.spacing(1),
  },
  formLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default useStyles;
