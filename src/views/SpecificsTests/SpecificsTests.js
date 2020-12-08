import React, { useState, useCallback, useEffect } from 'react';

import useStyles from './styles';
import { CustomBreadcrumbs, NotToShowImg } from 'components';
import { useParams, useHistory } from 'react-router-dom';
import {
  CircularProgress,
  FormControl,
  Typography,
  Grid,
  Button,
  Card,
} from '@material-ui/core';
import { Formik, Form } from 'formik';
import schema from './schema';
import SelectTestType from './components/SelectTestType';
import TestRTCPRList from './components/TestRTCPRList';
import TestRapidoList from './components/TestRapidoList';
import api from 'services/api';
import { useToast } from 'hooks/toast';
import PatientInfo from 'components/PatientInfo';
import { usePatient } from 'context/PatientContext';
import TesteFormList from './components/TesteFormList';
import EmptyRTPCRError from 'errors/EmptyRTPCRError';

// Valores iniciais
const initialValues = {
  newsTestes: [],
  tipo_new_teste: '',
};

const SpecificsTests = () => {
  let { id } = useParams();

  const { patient } = usePatient();

  id = id ? id : patient.id;

  const classes = useStyles();

  const [loading, setLoading] = useState(false);

  const [examesPCR, setexamesPCR] = useState([]);

  const [examesTesteRapido, setExamesTesteRapido] = useState([]);

  const history = useHistory();

  const { addToast } = useToast();

  // trata de carregar as informações
  const handleSpecificsTests = useCallback(
    async id => {
      try {
        setLoading(true);

        const response = await api.get(`pacientes/${id}/exames-laboratoriais`);
        const { exames_pcr, exames_teste_rapido } = response.data;

        setexamesPCR(exames => [...exames, ...exames_pcr]);
        setExamesTesteRapido(exames => [...exames, ...exames_teste_rapido]);
      } catch (err) {
        // TODO: remover depois
        console.log(err);
        addToast({
          type: 'error',
          message: 'Algo inesperado aconteceu. Tente novamente.',
        });
        history.goBack();
      } finally {
        setLoading(false);
      }
    },
    [addToast, history],
  );

  useEffect(() => {
    handleSpecificsTests(id);
  }, [handleSpecificsTests, id]);

  const handleSubmit = async ({ newsTestes }) => {
    try {
      // Verificando pre submit
      newsTestes.forEach(item => {
        if (
          item.tipo_teste === 'RTPCR' &&
          !item.data_coleta &&
          !item.resultado
        ) {
          throw new EmptyRTPCRError(
            'Não foi possível salvar pois campos obrigatórios não foram informados',
          );
        }
      });

      // sanitizando os dasos de novos testes para o envio
      const newsTestesSanitized = newsTestes.map(test =>
        test.tipo_teste === 'RTPCR'
          ? {
            data_coleta: test.data_coleta,
            sitio_tipo_id: test.sitio_tipo,
            data_resultado: test.data_resultado,
            rt_pcr_resultado_id: test.rt_pcr_resultado,
          }
          : {
            data_realizacao: test.data_realizacao,
            resultado: test.resultado === 'true' ? true : false,
          },
      );

      // criando as promises
      const newsTestesPromises = newsTestesSanitized.map(test =>
        api.post(`/pacientes/${id}/exames-laboratoriais`, test),
      );

      // tentando salvar mas sem nada para enviar.
      if (newsTestesPromises.length === 0) {
        addToast({
          type: 'error',
          message: 'Nada para salvar.',
        });
        return;
      }

      // enviando todas as requests juntas.
      await Promise.all(newsTestesPromises);

      addToast({
        type: 'success',
        message: 'Dados salvos com sucesso.',
      });

      window.location.reload();
    } catch (err) {
      if (err instanceof EmptyRTPCRError) {
        addToast({
          type: 'warning',
          message: err.message,
        });
      } else {
        addToast({
          type: 'error',
          message: 'Algo de errado aconteceu',
        });
      }
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
              label: 'Exames laboratoriais específicos COVID 19',
              route: `/categorias/exames-especificos/${id}`,
            },
          ]}
        />

        {loading ? (
          <CircularProgress />
        ) : (
          <div className={classes.formWrapper}>
            <Formik
              enableReinitialize
              initialValues={initialValues}
              onSubmit={handleSubmit}
              validateOnMount
              validationSchema={schema}
            >
              {({ isSubmitting, values }) => (
                <Form component={FormControl}>
                  <div className={classes.titleWrapper}>
                    <Typography variant="h2">
                      Exames laboratoriais específicos COVID 19
                    </Typography>
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

                  <Grid
                    className={classes.content}
                    component={Card}
                    container
                    direction="column"
                    spacing={2}
                  >
                    <SelectTestType />

                    <TesteFormList />

                    <TestRTCPRList testes={examesPCR} />

                    <TestRapidoList testes={examesTesteRapido} />

                    {examesPCR.length === 0 &&
                      examesTesteRapido.length === 0 &&
                      values.newsTestes.length === 0 && (
                      <Grid item>
                        <NotToShowImg label="Nenhum exame foi adicionado" />
                      </Grid>
                    )}
                  </Grid>

                  {/* TODO: Colocar depois do primeiro MVP */}
                  {/* <FormikErroObserver /> */}
                </Form>
              )}
            </Formik>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecificsTests;
