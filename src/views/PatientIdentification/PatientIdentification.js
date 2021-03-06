import React, { useState, useEffect, useCallback } from 'react';
import CustomBreadcrumbs from 'components/CustomBreadcrumbs';
import useStyles from './styles';
import { Formik, Form, Field } from 'formik';
import schema from './schema';

import {
  FormControl,
  Typography,
  Grid,
  FormGroup,
  FormLabel,
  TextField,
  Card,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
} from '@material-ui/core';
import { TextMaskPhone } from 'components';
import PatientInfo from 'components/PatientInfo';
import api from 'services/api';
import { useParams, useHistory } from 'react-router-dom';
import { usePatient } from 'context/PatientContext';
import { useToast } from 'hooks/toast';

const PatientIdentification = () => {
  const history = useHistory();

  const classes = useStyles();

  const { id } = useParams();

  // buscando o paciente pelo contexto
  const { patient } = usePatient();

  // usados para validar dados
  const { data_internacao, data_inicio_sintomas } = patient;

  let patientId = id ? id : patient.id;

  const { addToast } = useToast();

  const [initialValues, setinItialValues] = useState({
    municipio_id: '0',
    bairro_id: '0',
    estado_id: '0',
    telefone_de_casa: '',
    telefone_celular: '',
    telefone_do_trabalho: '',
    telefone_de_vizinho: '',
    sexo: '0',
    data_nascimento: '',
    estado_nascimento_id: '0',
    cor_id: '0',
    estado_civil_id: '0',
    escolaridade_id: '0',
    atividade_profissional_id: '0',
    qtd_pessoas_domicilio: '0',
    municipios: [],
    isPrevSaved: false,
    data_internacao: data_internacao || '',
    data_ultimo_desfecho: '',
    data_inicio_sintomas: data_inicio_sintomas || '',
  });

  // Buscando a Lista de Estados
  const [estados, setEstados] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await api.get('/estados');
      setEstados(response.data);
    })();
  }, []);

  // Buscando a Lista de Cores
  const [cores, setCores] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await api.get('/cores');
      setCores(response.data);
    })();
  }, []);

  // Buscando a Lista de Estados-civis
  const [estadosCivis, setEstadosCivis] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await api.get('/estados-civis');
      setEstadosCivis(response.data);
    })();
  }, []);

  // Buscando a Lista Escolaridades
  const [escolaridades, setEscolaridades] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await api.get('/escolaridades');
      setEscolaridades(response.data);
    })();
  }, []);

  // Buscando a Lista de Atividades profissionais
  const [atividadesProfissionais, setAtividadesProfissionais] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await api.get('/atividades-profissionais');
      setAtividadesProfissionais(response.data);
    })();
  }, []);

  // Buscando a Lista de Bairros
  const [bairros, setBairros] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await api.get('/bairros');
      setBairros(response.data);
    })();
  }, []);

  // Buscando a data do ultimo desfecho
  useEffect(() => {
    api
      .get(`pacientes/${patientId}/desfecho/ultimo`)
      .then(response => {
        const { desfecho } = response.data;
        if (desfecho.data) {
          // muda apenas o valor de data_ultimo_desfecho
          setinItialValues(old => ({
            ...old,
            data_ultimo_desfecho: desfecho.data,
          }));
        }
      })
      .catch(error => {
        console.log(error);
      });
  }, [patientId]);

  const handleInfos = useCallback(async () => {
    try {
      const response = await api.get(`/pacientes/${patientId}/identificacao`);

      // busca os possíveis municípios do estado_id
      const municipiosSelected = await getMunicipios(response.data.estado.id);

      const { telefones } = response.data;

      // setando os telefones caso existam
      telefones.forEach(telefone => {
        switch (telefone.tipo.trim()) {
          case 'casa':
            setinItialValues(initialValues => ({
              ...initialValues,
              telefone_de_casa: telefone.numero,
            }));
            break;
          case 'celular':
            setinItialValues(initialValues => ({
              ...initialValues,
              telefone_celular: telefone.numero,
            }));
            break;
          case 'trabalho':
            setinItialValues(initialValues => ({
              ...initialValues,
              telefone_do_trabalho: telefone.numero,
            }));
            break;
          case 'vizinho':
            setinItialValues(initialValues => ({
              ...initialValues,
              telefone_de_vizinho: telefone.numero,
            }));
            break;
          default:
            break;
        }
      });

      setinItialValues(initialValues => ({
        ...initialValues,
        sexo: response.data.sexo ? response.data.sexo : '0',
        data_nascimento: response.data.data_nascimento
          ? response.data.data_nascimento
          : '',
        cor_id: response.data.cor ? response.data.cor.id.toString() : '',
        estado_civil_id: response.data.estado_civil
          ? response.data.estado_civil.id.toString()
          : '',
        estado_nascimento_id: response.data.estado_nascimento
          ? response.data.estado_nascimento.id
          : '',
        escolaridade_id: response.data.escolaridade
          ? response.data.escolaridade.id.toString()
          : '',
        atividade_profissional_id: response.data.atividade_profissional
          ? response.data.atividade_profissional.id.toString()
          : '',
        qtd_pessoas_domicilio: response.data.qtd_pessoas_domicilio
          ? response.data.qtd_pessoas_domicilio.toString()
          : '',
        estado_id: response.data.estado
          ? response.data.estado.id.toString()
          : '0',
        municipio_id: response.data.municipio
          ? response.data.municipio.id.toString()
          : '0',
        bairro_id: response.data.bairro
          ? response.data.bairro.id.toString()
          : '0',
        municipios: response.data.estado ? municipiosSelected : [], // precisamos setar os estados quer podem ser selecionados inicialmente
      }));

      // verificando se já foi previamente salvo
      if (response.data.qtd_pessoas_domicilio !== 0) {
        setinItialValues(initialValues => ({
          ...initialValues,
          isPrevSaved: true,
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }, [patientId]);

  // Setando as variáveis do paciente no Formik
  useEffect(() => {
    handleInfos();
  }, [handleInfos]);

  /**
   * Retorna uma lista dos municípios de um estado.
   * Caso não seja informado o estado_id, então será retornado todos os municípios.
   * @param {number} estado_id id do estado.
   */
  async function getMunicipios(estado_id) {
    const response = await api.get('/municipios', {
      params: {
        conditions: `estado_id:=:${estado_id}`,
      },
    });
    return response.data;
  }

  const handleSubmit = async ({
    municipio_id,
    bairro_id,
    estado_id,
    telefone_de_casa,
    telefone_celular,
    telefone_do_trabalho,
    telefone_de_vizinho,
    sexo,
    data_nascimento,
    estado_nascimento_id,
    cor_id,
    estado_civil_id,
    escolaridade_id,
    atividade_profissional_id,
    qtd_pessoas_domicilio,
  }) => {
    const patienteUpdated = {
      municipio_id,
      bairro_id,
      estado_id,
      telefone_de_casa,
      telefone_celular,
      telefone_do_trabalho,
      telefone_de_vizinho,
      sexo,
      data_nascimento,
      estado_nascimento_id,
      cor_id,
      estado_civil_id,
      escolaridade_id,
      atividade_profissional_id,
      qtd_pessoas_domicilio,
    };

    // Sanitizando o paciente antes de enviar para a request
    const patientSanitized = Object.keys(patienteUpdated).reduce(
      (acc, curr) => {
        if (patienteUpdated[curr] !== '' && patienteUpdated[curr] !== '0') {
          return { ...acc, [curr]: patienteUpdated[curr] };
        }
        return acc;
      },
      {},
    );

    try {
      const response = await api.post(
        `/pacientes/${patientId}/identificacao`,
        patientSanitized,
      );
      const { status, data } = response;

      if (status === 201) {
        addToast({
          type: 'success',
          message: data.message,
        });
        history.push('/categorias');
      }
    } catch (err) {
      addToast({
        type: 'info',
        message: 'Identificação do paciente já existe',
      });
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
              label: 'Identificação do paciente',
              route: `/categorias/identificacao-paciente/${patientId}`,
            },
          ]}
        />
      </div>

      <div className={classes.formWrapper}>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validateOnMount
          validationSchema={schema}
        >
          {({
            values,
            touched,
            handleChange,
            isSubmitting,
            errors,
            setFieldValue,
          }) => (
            <Form component={FormControl}>
              <div className={classes.titleWrapper}>
                <Typography variant="h1">Identificação do paciente</Typography>

                <Grid
                  className={classes.actionSection}
                  item
                >
                  {/* patient info */}
                  <section className={classes.patienteInfo}>
                    <PatientInfo />
                  </section>
                  <Button
                    className={classes.buttonSave}
                    color="secondary"
                    disabled={isSubmitting || values.isPrevSaved}
                    type="submit"
                    variant="contained"
                  >
                    Salvar
                  </Button>
                </Grid>
              </div>

              <Grid
                component={Card}
                container
                item
                lg={10}
                spacing={2}
              >
                {/* estado_id */}
                <Grid
                  item
                  md={12}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Estado de residência</Typography>
                    </FormLabel>
                    <Field
                      as={TextField}
                      className={classes.textField}
                      error={errors.estado_id && touched.estado_id}
                      helperText={
                        errors.estado_id && touched.estado_id
                          ? errors.estado_id
                          : null
                      }
                      label="Estado de residência"
                      name="estado_id"
                      onChange={async e => {
                        const { value } = e.target; // estado_id
                        const municipiosSelected = await getMunicipios(value);
                        setFieldValue('estado_id', value);
                        setFieldValue('municipio_id', '');
                        setFieldValue('municipios', municipiosSelected);
                      }}
                      select
                      type="text"
                      value={values.estado_id}
                      variant="outlined"
                    >
                      <MenuItem
                        disabled
                        value={'0'}
                      >
                        Selecione um estado...
                      </MenuItem>
                      {estados.map(({ id, nome }) => (
                        <MenuItem
                          key={id}
                          value={id}
                        >
                          {nome}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormGroup>
                </Grid>

                {/* municipio_id */}
                <Grid
                  item
                  md={12}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">
                        Município de residência
                      </Typography>
                    </FormLabel>
                    <Field
                      as={TextField}
                      className={classes.textField}
                      disabled={!values.estado_id}
                      error={errors.municipio_id && touched.municipio_id}
                      helperText={
                        errors.municipio_id && touched.municipio_id
                          ? errors.municipio_id
                          : null
                      }
                      label="Município"
                      name="municipio_id"
                      onChange={handleChange}
                      select
                      type="text"
                      value={values.municipio_id}
                      variant="outlined"
                    >
                      <MenuItem
                        disabled
                        value="0"
                      >
                        Selecione um município...
                      </MenuItem>

                      {values.municipios &&
                        values.municipios.map(({ id, nome }) => (
                          <MenuItem
                            key={id}
                            value={id}
                          >
                            {nome}
                          </MenuItem>
                        ))}
                    </Field>
                  </FormGroup>
                </Grid>

                {/* bairro_id */}
                <Grid
                  item
                  md={12}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Bairro de residência</Typography>
                    </FormLabel>
                    <Field
                      as={TextField}
                      className={classes.textField}
                      // 1347 é o id da Cidade de Fortaleza
                      disabled={!(values.municipio_id === 1347)}
                      error={errors.bairro_id && touched.bairro_id}
                      helperText={
                        errors.bairro_id && touched.bairro_id
                          ? errors.bairro_id
                          : null
                      }
                      label="Bairro de residência"
                      name="bairro_id"
                      onChange={handleChange}
                      select
                      type="text"
                      value={values.bairro_id}
                      variant="filled"
                    >
                      <MenuItem
                        disabled
                        value="0"
                      >
                        Selecione um bairro...
                      </MenuItem>
                      {bairros.map(({ id, nome }) => (
                        <MenuItem
                          key={id}
                          value={id}
                        >
                          {nome}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormGroup>
                </Grid>

                {/* telefone_de_casa */}
                <Grid
                  item
                  md={6}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Telefone de casa</Typography>
                    </FormLabel>
                    <Field
                      as={TextField}
                      className={classes.textField}
                      error={
                        errors.telefone_de_casa && touched.telefone_de_casa
                      }
                      helperText={
                        errors.telefone_de_casa && touched.telefone_de_casa
                          ? errors.telefone_de_casa
                          : null
                      }
                      InputProps={{
                        inputComponent: TextMaskPhone,
                      }}
                      label="Telefone de casa"
                      name="telefone_de_casa"
                      onChange={handleChange}
                      type="text"
                      value={values.telefone_de_casa}
                      variant="outlined"
                    />
                  </FormGroup>
                </Grid>

                {/* telefone_celular */}
                <Grid
                  item
                  md={6}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Telefone celular</Typography>
                    </FormLabel>
                    <Field
                      as={TextField}
                      className={classes.textField}
                      error={
                        errors.telefone_celular && touched.telefone_celular
                      }
                      helperText={
                        errors.telefone_celular && touched.telefone_celular
                          ? errors.telefone_celular
                          : null
                      }
                      InputProps={{
                        inputComponent: TextMaskPhone,
                      }}
                      label="Telefone celular"
                      name="telefone_celular"
                      onChange={handleChange}
                      type="text"
                      value={values.telefone_celular}
                      variant="outlined"
                    />
                  </FormGroup>
                </Grid>

                {/* telefone_do_trabalho */}
                <Grid
                  item
                  md={6}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Telefone do trabalho</Typography>
                    </FormLabel>
                    <Field
                      as={TextField}
                      className={classes.textField}
                      error={
                        errors.telefone_do_trabalho &&
                        touched.telefone_do_trabalho
                      }
                      helperText={
                        errors.telefone_do_trabalho &&
                        touched.telefone_do_trabalho
                          ? errors.telefone_do_trabalho
                          : null
                      }
                      InputProps={{
                        inputComponent: TextMaskPhone,
                      }}
                      label="Telefone do trabalho"
                      name="telefone_do_trabalho"
                      onChange={handleChange}
                      type="text"
                      value={values.telefone_do_trabalho}
                      variant="outlined"
                    />
                  </FormGroup>
                </Grid>

                {/* telefone_de_vizinho */}
                <Grid
                  item
                  md={6}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Telefone do vizinho</Typography>
                    </FormLabel>
                    <Field
                      as={TextField}
                      className={classes.textField}
                      error={
                        errors.telefone_de_vizinho &&
                        touched.telefone_de_vizinho
                      }
                      helperText={
                        errors.telefone_de_vizinho &&
                        touched.telefone_de_vizinho
                          ? errors.telefone_de_vizinho
                          : null
                      }
                      InputProps={{
                        inputComponent: TextMaskPhone,
                      }}
                      label="Telefone do vizinho"
                      name="telefone_de_vizinho"
                      onChange={handleChange}
                      type="text"
                      value={values.telefone_de_vizinho}
                      variant="outlined"
                    />
                  </FormGroup>
                </Grid>

                {/* sexo */}
                <Grid
                  item
                  md={12}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Sexo</Typography>
                    </FormLabel>
                    <Field
                      as={TextField}
                      className={classes.textField}
                      error={errors.sexo && touched.sexo}
                      helperText={
                        errors.sexo && touched.sexo ? errors.sexo : null
                      }
                      label="Sexo"
                      name="sexo"
                      onChange={handleChange}
                      select
                      type="text"
                      value={values.sexo}
                      variant="outlined"
                    >
                      <MenuItem
                        disabled
                        value={'0'}
                      >
                        Selecione um sexo...
                      </MenuItem>
                      <MenuItem value={'F'}>Feminino</MenuItem>
                      <MenuItem value={'M'}>Masculino</MenuItem>
                    </Field>
                  </FormGroup>
                </Grid>

                {/* data_nascimento */}
                <Grid
                  item
                  md={6}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Data de nascimento</Typography>
                    </FormLabel>
                    <Field
                      as={TextField}
                      className={classes.dateField}
                      error={errors.data_nascimento && touched.data_nascimento}
                      helperText={
                        errors.data_nascimento && touched.data_nascimento
                          ? errors.data_nascimento
                          : null
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      label="Data de nascimento"
                      name="data_nascimento"
                      onChange={handleChange}
                      type="date"
                      value={values.data_nascimento}
                    />
                  </FormGroup>
                </Grid>

                {/* estado_nascimento_id */}
                <Grid
                  item
                  md={6}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Estado onde nasceu</Typography>
                    </FormLabel>
                    <Field
                      as={TextField}
                      className={classes.textField}
                      error={
                        errors.estado_nascimento_id &&
                        touched.estado_nascimento_id
                      }
                      helperText={
                        errors.estado_nascimento_id &&
                        touched.estado_nascimento_id
                          ? errors.estado_nascimento_id
                          : null
                      }
                      label="Estado onde nasceu"
                      name="estado_nascimento_id"
                      onChange={handleChange}
                      select
                      type="text"
                      value={values.estado_nascimento_id}
                      variant="outlined"
                    >
                      <MenuItem
                        disabled
                        value="0"
                      >
                        Selecione um estado...
                      </MenuItem>
                      {estados.map(({ id, nome }) => (
                        <MenuItem
                          key={id}
                          value={id}
                        >
                          {nome}
                        </MenuItem>
                      ))}
                    </Field>
                  </FormGroup>
                </Grid>

                {/* cor_id */}
                <Grid
                  item
                  md={6}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Cor (autoreferida)</Typography>
                    </FormLabel>
                    <Field
                      as={RadioGroup}
                      className={classes.radioGroup}
                      name="cor_id"
                      onChange={handleChange}
                      value={values.cor_id}
                    >
                      {cores.map(({ id, nome }) => (
                        <FormControlLabel
                          control={<Radio />}
                          key={id}
                          label={nome}
                          value={id.toString()}
                        />
                      ))}
                    </Field>
                  </FormGroup>
                </Grid>

                {/* estado_civil_id */}
                <Grid
                  item
                  md={6}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Estado civil</Typography>
                    </FormLabel>
                    <Field
                      as={RadioGroup}
                      className={classes.radioGroup}
                      name="estado_civil_id"
                      onChange={handleChange}
                      value={values.estado_civil_id}
                    >
                      {estadosCivis.map(({ id, nome }) => (
                        <FormControlLabel
                          control={<Radio />}
                          key={id}
                          label={nome}
                          value={id.toString()}
                        />
                      ))}
                    </Field>
                  </FormGroup>
                </Grid>

                {/* escolaridade_id */}
                <Grid
                  item
                  md={6}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">Escolaridade</Typography>
                    </FormLabel>
                    <Field
                      as={RadioGroup}
                      className={classes.radioGroup}
                      name="escolaridade_id"
                      onChange={handleChange}
                      value={values.escolaridade_id}
                    >
                      {escolaridades.map(({ id, nome }) => (
                        <FormControlLabel
                          control={<Radio />}
                          key={id}
                          label={nome}
                          value={id.toString()}
                        />
                      ))}
                    </Field>
                  </FormGroup>
                </Grid>

                {/* atividade_profissional_id */}
                <Grid
                  item
                  md={6}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">
                        Atividade profissional principal nos últimos 12 meses?
                        (Ocupação principal)
                      </Typography>
                    </FormLabel>
                    <Field
                      as={RadioGroup}
                      className={classes.radioGroup}
                      name="atividade_profissional_id"
                      onChange={handleChange}
                      value={values.atividade_profissional_id}
                    >
                      {atividadesProfissionais.map(({ id, nome }) => (
                        <FormControlLabel
                          control={<Radio />}
                          key={id}
                          label={nome}
                          value={id.toString()}
                        />
                      ))}
                    </Field>
                  </FormGroup>
                </Grid>

                {/* qtd_pessoas_domicilio */}
                <Grid
                  item
                  md={12}
                  sm={12}
                >
                  <FormGroup>
                    <FormLabel>
                      <Typography variant="h4">
                        Quantas pessoas residem no mesmo domicílio?
                      </Typography>
                    </FormLabel>
                    <Field
                      as={RadioGroup}
                      className={classes.radioGroup}
                      name="qtd_pessoas_domicilio"
                      onChange={handleChange}
                      row
                      value={values.qtd_pessoas_domicilio}
                    >
                      <FormControlLabel
                        control={<Radio />}
                        label="1"
                        value="1"
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label="2"
                        value="2"
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label="3"
                        value="3"
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label="4"
                        value="4"
                      />
                      <FormControlLabel
                        control={<Radio />}
                        label="5 ou mais"
                        value="5"
                      />
                    </Field>
                  </FormGroup>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PatientIdentification;
