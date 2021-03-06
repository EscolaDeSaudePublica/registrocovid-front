/* eslint-disable indent */
import React, { useState, useEffect, useCallback } from 'react';
import DoneIcon from '@material-ui/icons/Done';
import {
  Typography,
  Button,
  Paper,
  RadioGroup,
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  Chip,
  TextField,
  Grid,
  CircularProgress,
} from '@material-ui/core';

import schema from './schema';
import { useHistory } from 'react-router-dom';

import { Formik, Form, Field, ErrorMessage } from 'formik';

import { useToast } from 'hooks/toast';
import { usePatient } from 'context/PatientContext';

import api from 'services/api';

import useStyles from './styles';
import CustomBreadcrumbs from 'components/CustomBreadcrumbs';
import PatientInfo from 'components/PatientInfo';

// Card, RadioButton, Field --> date, Chip, Grid para responsividade

const InitialSymptoms = () => {
  const classes = useStyles();

  const { patient, addPatient } = usePatient();

  const history = useHistory();

  const { addToast } = useToast();

  // usados para validações
  const [dataInternacao, setDataInternacao] = useState('');
  const [dataInicioSintomas, setDataInicioSintomas] = useState('');

  const [selectedSintomas, setSelectedSintomas] = useState([]);
  const [selectedSintomasHasChanged, setSelectedSintomasHasChanged] = useState(
    false,
  );
  const [sintomasListagem, setSintomasListagem] = useState([{}]);

  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleInfoPatient = useCallback(() => {
    api
      .get(`/pacientes/${patient.id}`)
      .then(response => {
        setDataInternacao(response.data.data_internacao);
        setDataInicioSintomas(response.data.data_inicio_sintomas);
      })
      .catch(error => {
        addToast({
          type: 'error',
          message:
            'Ocorreu um erro ao carregar as informações do paciente, por favor tente novamente',
        });
      });
  }, [addToast, patient.id]);

  // carregando as informações do paciente
  useEffect(handleInfoPatient, []);

  useEffect(() => {
    setIsFetching(true);
    try {
      api.get('/sintomas').then(response => {
        setSintomasListagem(response.data);
        setSelectedSintomas(patient.sintomas?.map(sintoma => sintoma.id) || []);
        setIsFetching(false);
      });
    } catch (err) {
      addToast({
        type: 'error',
        message:
          'Ocorreu um erro ao carregar os sintomas, por favor tente novamente',
      });
      setIsFetching(false);
    }
  }, [addToast, patient.sintomas]);

  // Checando se os sintomas selecionados são o mesmo do que o paciente já possui
  useEffect(() => {
    if (patient.sintomas?.length !== selectedSintomas.length) {
      setSelectedSintomasHasChanged(true);
    } else {
      const checkHasNotChanged = selectedSintomas.every(sintomaId => {
        const index = patient.sintomas.findIndex(
          sintoma => sintoma.id === sintomaId,
        );

        return index > -1;
      });

      setSelectedSintomasHasChanged(!checkHasNotChanged);
    }
  }, [selectedSintomas, patient.sintomas]);

  const handleClickChip = async sintomaId => {
    const exists = selectedSintomas.some(
      selectedSintomaId => selectedSintomaId === sintomaId,
    );

    if (exists) {
      const updatedSelectedSintomas = selectedSintomas.filter(
        selectedSintomaId => selectedSintomaId !== sintomaId,
      );

      setSelectedSintomas(updatedSelectedSintomas);
    } else {
      setSelectedSintomas([...selectedSintomas, sintomaId]);
    }
  };

  const handleSubmit = async (values, dirty) => {
    setIsSaving(true);
    try {
      if ((!dirty && !selectedSintomasHasChanged) || isSaving) {
        return;
      }

      const patientSubmitData = {
        sintomas: selectedSintomas,
      };

      if (values.data_inicio_sintomas) {
        patientSubmitData.data_inicio_sintomas = values.data_inicio_sintomas;
      }

      if (values.caso_confirmado) {
        const checkCasoConfirmado = values.caso_confirmado === 'confirmed';

        patientSubmitData.caso_confirmado = checkCasoConfirmado;
      }

      let response = await api.patch(
        `/pacientes/${patient.id}`,
        patientSubmitData,
      );

      addPatient({
        ...patient,
        sintomas: response.data.sintomas,
        caso_confirmado: values.caso_confirmado === 'confirmed',
        data_inicio_sintomas: values.data_inicio_sintomas,
      });

      addToast({
        type: 'success',
        message: 'Dados salvos com sucesso',
      });

      setIsSaving(false);
      history.push('/categorias');
    } catch (err) {
      addToast({
        type: 'error',
        message:
          'Ocorreu um erro ao salvar os dados, por favor, tente novamente',
      });
      setIsSaving(false);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <CustomBreadcrumbs
          links={[
            { label: 'Meus pacientes', route: '/meus-pacientes' },
            { label: 'Categorias', route: '/categorias' },
            {
              label: 'Sintomas Iniciais',
              route: '/categorias/sintomas-iniciais',
            },
          ]}
        />
      </div>
      <Formik
        enableReinitialize
        initialValues={{
          caso_confirmado:
            patient.caso_confirmado !== null
              ? patient.caso_confirmado
                ? 'confirmed'
                : 'suspect'
              : '',
          data_internacao: dataInternacao || '',
          data_inicio_sintomas: dataInicioSintomas || '',
        }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ values, handleChange, dirty, errors, touched }) => (
          <Form component={FormControl}>
            <div className={classes.titleWrapper}>
              <Typography variant="h1">Sintomas Iniciais</Typography>

              <div className={classes.patientWrapper}>
                <PatientInfo />
                <Button
                  className={classes.buttonSave}
                  color="secondary"
                  disabled={(!dirty && !selectedSintomasHasChanged) || isSaving}
                  type="submit"
                  variant="contained"
                >
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>

            <Grid container>
              <Grid
                item
                lg={2}
                md={6}
              />
              <Grid
                item
                lg={8}
              >
                <Paper className={classes.paper}>
                  <FormGroup
                    className={classes.control}
                    component="fieldset"
                  >
                    <FormLabel
                      className={classes.label}
                      component="legend"
                    >
                      Tipo caso à admissão:
                    </FormLabel>

                    <Field
                      as={RadioGroup}
                      name="caso_confirmado"
                      onChange={handleChange}
                      value={values.caso_confirmado}
                    >
                      <FormControlLabel
                        control={<Radio />}
                        label="Caso suspeito"
                        value="suspect"
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label="Caso confirmado"
                        value="confirmed"
                      />
                    </Field>
                  </FormGroup>

                  <FormGroup
                    className={classes.control}
                    component="fieldset"
                  >
                    <FormLabel
                      className={classes.label}
                      component="legend"
                    >
                      Selecione os sintomas que o paciente apresentou
                    </FormLabel>
                    <div className={classes.chipWrapper}>
                      {isFetching ? (
                        <CircularProgress />
                      ) : (
                        sintomasListagem?.map((sintomaListagem, index) =>
                          selectedSintomas?.some(
                            idSintoma => idSintoma === sintomaListagem.id,
                          ) ? (
                            <Chip
                              clickable
                              color="primary"
                              icon={<DoneIcon />}
                              key={index}
                              label={sintomaListagem.nome}
                              onClick={() =>
                                handleClickChip(sintomaListagem.id)
                              }
                            />
                          ) : (
                            <Chip
                              clickable
                              key={index}
                              label={sintomaListagem.nome}
                              onClick={() =>
                                handleClickChip(sintomaListagem.id)
                              }
                            />
                          ),
                        )
                      )}
                    </div>
                  </FormGroup>

                  <FormGroup
                    className={classes.fixWidthSize}
                    component="fieldset"
                  >
                    <FormLabel
                      className={classes.label}
                      component="legend"
                    >
                      Data do início dos sintomas
                    </FormLabel>
                    <Field
                      as={TextField}
                      error={
                        errors.data_inicio_sintomas &&
                        touched.data_inicio_sintomas
                      }
                      helperText={<ErrorMessage name="data_inicio_sintomas" />}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label="Início dos sintomas"
                      name="data_inicio_sintomas"
                      onChange={handleChange}
                      type="date"
                      value={values.data_inicio_sintomas}
                    />
                  </FormGroup>
                </Paper>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default InitialSymptoms;
