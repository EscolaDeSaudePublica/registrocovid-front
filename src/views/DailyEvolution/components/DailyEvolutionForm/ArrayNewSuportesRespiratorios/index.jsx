/* eslint-disable no-unused-vars */
import { FieldArray, useFormikContext } from 'formik';
import React from 'react';
import NewRespiratorySuportForm from '../NewRespiratorySuportForm';
import useStyles from './styles';

const NAME = 'newSuportesRespitatorios';

function ArrayNewSuportesRespiratorios(props) {
  const { tipos } = props;

  // TODO: remover isso depois
  console.log(tipos);

  const classes = useStyles();

  const { values } = useFormikContext();

  if (!values[NAME]) return null;

  return (
    <FieldArray name={NAME}>
      {({ remove }) => (
        <div className={classes.root}>
          {values[NAME] &&
            values[NAME].map((elem, index) => (
              <NewRespiratorySuportForm
                descricao="Alguma coisa aqui"
                index={index}
                key={index}
                name={NAME}
                remove={remove}
                tipo={elem.tipo_suporte_id}
              />
            )).reverse()}
        </div>
      )}
    </FieldArray>
  );
}

export default ArrayNewSuportesRespiratorios;
