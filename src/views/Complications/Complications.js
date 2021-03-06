import React, { useState, useCallback, useEffect } from 'react';

import useStyles from './styles';
import { CustomBreadcrumbs } from 'components';
import { useParams, useHistory } from 'react-router-dom';
import { CircularProgress, Typography, Grid, Button } from '@material-ui/core';
import { Formik, Form } from 'formik';
import schema from './schema';
import SelectComplicationType from './components/SelectComplicationType';
import ComplicationsList from './components/ComplicationsList';
import api from 'services/api';
import { useToast } from 'hooks/toast';
import PatientInfo from 'components/PatientInfo';
import { usePatient } from 'context/PatientContext';
import { sanitizeComplicacoes } from 'models/complicacaoes/ComplicacaoesService';

const initialValues = {
  newsComplicacoes: [],
  tipo_new_complication: '',
};

const Complications = () => {
  let { id } = useParams();

  const { patient } = usePatient();

  id = id ? id : patient.id;

  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [complicacoes, setComplicacoes] = useState([]);
  const [tipoComplicacoes, setTipoComplicacoes] = useState([]);
  const history = useHistory();

  const { addToast } = useToast();

  const handleComplications = useCallback(async () => {
    try {
      setLoading(true);

      const [complications, tipoComplications] = await Promise.all([
        api.get(`pacientes/${patient.id}/complicacoes`),
        api.get('tipos-complicacoes'),
      ]);

      setComplicacoes(comp => [...comp, ...complications.data]);
      setTipoComplicacoes(comp => [...comp, ...tipoComplications.data]);
    } catch (err) {
      addToast({
        type: 'error',
        message: 'Algo inesperado aconteceu. Tente novamente.',
      });
      history.goBack();
    } finally {
      setLoading(false);
    }
  }, [addToast, history, patient]);

  useEffect(() => {
    handleComplications(id);
  }, [handleComplications, id]);

  const handleSubmit = async ({ newsComplicacoes }) => {
    try {
      const newsComplicacoesSanitized = sanitizeComplicacoes(newsComplicacoes);

      if (newsComplicacoesSanitized.length === 0) {
        addToast({
          type: 'warning',
          message: 'Nada para salvar.',
        });
        return;
      }
      await api.post(
        `/pacientes/${id}/complicacoes`,
        newsComplicacoesSanitized,
      );
      addToast({
        type: 'success',
        message: 'Dados salvos com sucesso.',
      });
      window.location.reload();
    } catch (e) {
      console.log(e);
      addToast({
        type: 'warning',
        message: 'Um erro ocorreu. Tente novamente.',
      });
      return;
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
              label: 'Complicações',
              route: '/categorias/complicacoes',
            },
          ]}
        />

        {loading ? (
          <CircularProgress />
        ) : (
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validateOnBlur={false}
            validateOnChange={false}
            validateOnMount
            validationSchema={schema}
          >
            {({ isSubmitting, values }) => (
              <Form>
                <div className={classes.titleWrapper}>
                  <Typography variant="h2">Complicações</Typography>
                  <Grid
                    className={classes.actionSection}
                    item
                  >
                    <PatientInfo />
                    <Button
                      className={classes.buttonSave}
                      color="secondary"
                      disabled={isSubmitting}
                      type="submit"
                      variant="contained"
                    >
                      Salvar
                    </Button>
                  </Grid>
                </div>

                <Grid className={classes.formWrapper}>
                  <SelectComplicationType
                    tiposComplicacoes={tipoComplicacoes}
                  />
                  <ComplicationsList complicacoes={complicacoes} />
                </Grid>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default Complications;
