import React, { memo } from 'react';
import {
  Grid,
  Card,
  FormLabel,
  Typography,
  FormGroup,
  TextField,
  IconButton,
} from '@material-ui/core';
import useStyles from './styles';
import PropTypes from 'prop-types';
import { useFormikContext, Field, ErrorMessage } from 'formik';
import DeleteIcon from '@material-ui/icons/Delete';

// import schema from '../../schema';

const IRASForm = ({ index, remove, children }) => {
  const classes = useStyles();

  const { values, handleChange, errors, touched } = useFormikContext();

  return (
    <Grid
      className={classes.root}
      component={Card}
      container
      item
    >
      <FormLabel className={classes.formLabel}>
        <Typography
          className={classes.tipoIRASDescricao}
          variant="h4"
        >
          {values.newIRASs[index].tipo_iras_descricao}
        </Typography>
        <IconButton
          aria-label="delete"
          onClick={() => remove(index)}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </FormLabel>

      {/* descricao */}
      {/* 5 é o id do tipo de IRAS 'Outros' */}
      {values.newIRASs[index].tipo_iras_id === '5' && (
        <Grid
          className={classes.fieldWraper}
          item
          sm={12}
        >
          <FormGroup>
            <FormLabel>
              <Typography variant="h5">Descrição da infecção</Typography>
            </FormLabel>
            <Field
              InputLabelProps={{
                shrink: true,
              }}
              as={TextField}
              className={classes.field}
              name={`newIRASs.${index}.descricao`}
              onChange={handleChange}
              type="text"
              value={values.newIRASs[index].descricao}
              variant="outlined"
            />
          </FormGroup>
        </Grid>
      )}

      <Grid
        className={classes.formWraper}
        container
        spacing={1}
      >
        {/* data */}
        <Grid
          className={classes.fieldWraper}
          item
          sm={12}
        >
          <FormGroup>
            <FormLabel>
              <Typography variant="h5">Ocorrência</Typography>
            </FormLabel>
            <Field
              InputLabelProps={{
                shrink: true,
              }}
              as={TextField}
              className={classes.field}
              error={
                errors.newIRASs &&
                touched.newIRASs &&
                !!errors.newIRASs[index]?.data
              }
              helperText={<ErrorMessage name={`newIRASs.${index}.data`} />}
              label="Data"
              name={`newIRASs.${index}.data`}
              onChange={handleChange}
              type="date"
              value={values.newIRASs[index].data}
            />
          </FormGroup>
        </Grid>

        {children}
      </Grid>
    </Grid>
  );
};

IRASForm.propTypes = {
  index: PropTypes.number.isRequired,
  remove: PropTypes.func.isRequired,
};

export default memo(IRASForm);
