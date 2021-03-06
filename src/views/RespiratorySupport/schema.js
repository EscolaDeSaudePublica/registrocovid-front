import * as Yup from 'yup';

const schema = Yup.object().shape({
  newSuportesRespitatorios: Yup.array().of(
    Yup.object().shape({
      tipo_suporte_id: Yup.string(),
      data_inicio: Yup.string().when('tipo_suporte_id', (tipo, schema) =>
        ['1', '2', '3', '4', '5', '6', '7', '8', '9'].some(
          item => item === tipo,
        )
          ? schema.required('Campo obrigatório')
          : schema,
      ),
      data_termino: Yup.string().when('tipo_suporte_id', (tipo, schema) =>
        ['1', '2', '3', '4', '5', '6', '7', '8', '9'].some(
          item => item === tipo,
        )
          ? schema.required('Campo obrigatório')
          : schema,
      ),
      data_pronacao: Yup.string().when('tipo_suporte_id', (tipo, schema) =>
        ['10'].some(item => item === tipo)
          ? schema.required('Campo obrigatório')
          : schema,
      ),
      data_inclusao_desmame: Yup.string().when(
        'tipo_suporte_id',
        (tipo, schema) =>
          ['11'].some(item => item === tipo)
            ? schema.required('Campo obrigatório')
            : schema,
      ),
    }),
  ),
});

export default schema;
