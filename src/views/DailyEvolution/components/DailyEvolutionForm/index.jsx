import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useCallback,
} from 'react';
import { Card, FormControl, Grid } from '@material-ui/core';
import { Form, Formik } from 'formik';
import { buscarTiposSuporteRespiratorio } from 'services/requests/datasRequests';
import RespiratorySuportFormList from './RespiratorySuportFormList';
import FieldsBlock from './FieldsBlock';
import schema from './schema';
import SelectType from './SelectType';
import { makeStyles } from '@material-ui/styles';

const initialValues = {
  data_evolucao: '',
  temperatura: '',
  frequencia_respiratoria: '',
  peso: '',
  altura: '',
  pressao_sistolica: '',
  pressao_diastolica: '',
  frequencia_cardiaca: '',
  ausculta_pulmonar: '',
  oximetria: '',
  escala_glasgow: 1,
  tipo_suporte_selected: 0,
  newSuportesRespitatorios: [],
};

const useStyles = makeStyles(() => ({
  contentForm: {
    maxWidth: '684px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

const DailyEvolutionForm = (props, ref) => {
  const classes = useStyles();

  const [tiposSuporteRespiratorio, setTiposSuporteRespiratorio] = useState([]);
  // TODO: implementar
  const handleSubmit = () => {
    console.log('DailyEvolutionForm.handleSubmit');
  };

  const handleFetchTiposSuporteRespiratorio = useCallback(async () => {
    try {
      const response = await buscarTiposSuporteRespiratorio();
      setTiposSuporteRespiratorio(response);
    } catch (error) {
      // TODO: melhorar isso aqui
      console.log(error);
    }
  }, []);

  useEffect(() => {
    handleFetchTiposSuporteRespiratorio();
  }, [handleFetchTiposSuporteRespiratorio]);

  useImperativeHandle(ref, () => {
    return {
      handleSubmit,
    };
  });

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnMount
      validationSchema={schema}
    >
      {({ isSubmitting, values }) => (
        <Form
          className={classes.form}
          component={FormControl}
        >
          <Grid
            className={classes.contentForm}
            component={Card}
            container
            spacing={2}
          >
            <FieldsBlock />
            <SelectType tipos={tiposSuporteRespiratorio} />
            <RespiratorySuportFormList tipos={tiposSuporteRespiratorio} />
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default forwardRef(DailyEvolutionForm);
