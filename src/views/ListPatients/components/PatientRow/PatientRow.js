import React, { memo } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { TableRow, TableCell, Button } from '@material-ui/core';

import { usePatient } from 'context/PatientContext';

import formatDate from 'helpers/formatDate';

const PatientRow = props => {
  const { patient, ...rest } = props;
  const { addPatient } = usePatient();

  const history = useHistory();

  const handleNavigate = (patientProps) => {
    addPatient(patientProps);
    history.push('/categorias');
  };

  return (
    <TableRow
      {...rest}
      onClick={() => handleNavigate(patient)}
    >
      <TableCell align="left">
        <strong>#</strong> {patient.prontuario}
      </TableCell>
      <TableCell align="left">{formatDate(patient.data_internacao)}</TableCell>
      <TableCell align="left">{patient.created_at}</TableCell>
      <TableCell align="right">
        <Button color="inherit">
          <NavigateNextIcon fontSize="small" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

PatientRow.propTypes = {
  className: PropTypes.string,
  patient: PropTypes.exact({
    id: PropTypes.number,
    prontuario: PropTypes.string,
    data_internacao: PropTypes.string,
    created_at: PropTypes.string,
  }).isRequired,
};

export default memo(PatientRow);
