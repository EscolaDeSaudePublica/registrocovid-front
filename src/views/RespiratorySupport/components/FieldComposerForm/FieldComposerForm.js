import {
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputAdornment,
  Switch,
  Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { Field } from 'formik';
import { TextField } from 'formik-material-ui';
import React, { memo } from 'react';

const FieldComposerForm = props => {
  const { field, name } = props;
  const fields = {
    fluxo_o2: (
      <Grid
        item
        xs={6}
      >
        <FormGroup>
          <FormLabel>
            <Typography variant="h5">Fluxo O₂</Typography>
          </FormLabel>
          <Field
            component={TextField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">l/min</InputAdornment>
              ),
            }}
            name={name}
            type="number"
            variant="outlined"
          />
        </FormGroup>
      </Grid>
    ),
    data_inicio: (
      <Grid
        item
        xs={6}
      >
        <FormGroup>
          <FormLabel>
            <Typography variant="h5">Inicio</Typography>
          </FormLabel>
          <Field
            component={TextField}
            name={name}
            type="date"
            variant="outlined"
          />
        </FormGroup>
      </Grid>
    ),
    data_termino: (
      <Grid
        item
        xs={6}
      >
        <FormGroup>
          <FormLabel>
            <Typography variant="h5">Término</Typography>
          </FormLabel>
          <Field
            component={TextField}
            name={name}
            type="date"
            variant="outlined"
          />
        </FormGroup>
      </Grid>
    ),
    concentracao_o2: (
      <Grid
        item
        xs={6}
      >
        <FormGroup>
          <FormLabel>
            <Typography variant="h5">Concentração O₂</Typography>
          </FormLabel>
          <Field
            component={TextField}
            InputProps={{
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            name={name}
            type="number"
            variant="outlined"
          />
        </FormGroup>
      </Grid>
    ),
    menos_24h_vmi: (
      <Grid
        item
        xs={6}
      >
        <FormGroup>
          <FormLabel>
            <Typography variant="h5">
              Paciente permaneceu menos de 24h em ventilação invasiva?
            </Typography>
          </FormLabel>
          <Field
            component={FormControlLabel}
            control={
              <Switch
                color="primary"
                type="checkbox"
              />
            }
            label={<Typography variant="h5">Sim</Typography>}
            name={name}
          />
        </FormGroup>
      </Grid>
    ),
    fluxo_sangue: (
      <Grid
        item
        xs={6}
      >
        <FormGroup>
          <FormLabel>
            <Typography variant="h5">Fluxo de sangue</Typography>
          </FormLabel>
          <Field
            component={TextField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">l/min</InputAdornment>
              ),
            }}
            name={name}
            type="number"
            variant="outlined"
          />
        </FormGroup>
      </Grid>
    ),
    fluxo_gasoso: (
      <Grid
        item
        xs={6}
      >
        <FormGroup>
          <FormLabel>
            <Typography variant="h5">Fluxo gasoso</Typography>
          </FormLabel>
          <Field
            component={TextField}
            contentEditable={false}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">l/min</InputAdornment>
              ),
            }}
            name={name}
            type="number"
            variant="outlined"
          />
        </FormGroup>
      </Grid>
    ),
    fio2: (
      <Grid
        item
        xs={6}
      >
        <FormGroup>
          <FormLabel>
            <Typography variant="h5">FiO₂</Typography>
          </FormLabel>
          <Field
            component={TextField}
            InputProps={{
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            name={name}
            type="number"
            variant="outlined"
          />
        </FormGroup>
      </Grid>
    ),
    data_pronacao: (
      <Grid
        item
        xs={6}
      >
        <FormGroup>
          <FormLabel>
            <Typography variant="h5">Data de pronação</Typography>
          </FormLabel>
          <Field
            component={TextField}
            name={name}
            type="date"
            variant="outlined"
          />
        </FormGroup>
      </Grid>
    ),
    quantidade_horas: (
      <Grid
        item
        xs={6}
      >
        <FormGroup>
          <FormLabel>
            <Typography variant="h5">Pronação</Typography>
          </FormLabel>
          <Field
            component={TextField}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">hora(s)</InputAdornment>
              ),
            }}
            name={name}
            type="number"
            variant="outlined"
          />
        </FormGroup>
      </Grid>
    ),
    data_inclusao_desmame: (
      <Grid item>
        <FormGroup>
          <FormLabel>
            <Typography variant="h5">
              Em caso afirmativo, informe a data da inclusão do paciente no
              desmame
            </Typography>
          </FormLabel>
          <Field
            component={TextField}
            name={name}
            type="date"
            variant="outlined"
          />
        </FormGroup>
      </Grid>
    ),
  };

  return fields[field];
};

FieldComposerForm.propTypes = {
  field: PropTypes.oneOf([
    'fluxo_o2',
    'data_inicio',
    'data_termino',
    'menos_24h_vmi',
    'concentracao_o2',
    'fluxo_sangue',
    'fluxo_gasoso',
    'fio2',
    'data_pronacao', // pronacao
    'quantidade_horas', // pronacao
    'data_inclusao_desmame', // desmane
  ]).isRequired,
  name: PropTypes.any.isRequired,
};

export default memo(FieldComposerForm);
