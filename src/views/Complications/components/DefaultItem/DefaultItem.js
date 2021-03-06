import React from 'react';
import {
  Grid,
  Typography,
  TextField,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@material-ui/core';
import formatDate from '../../../../helpers/formatDate';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import useStyles from './styles';

const DefaultItem = ({ complicationData, separator }) => {
  const classes = useStyles();

  return (
    <Accordion className={separator ? classes.typeSeparator : ''}>
      <AccordionSummary
        aria-controls="panel1a-content"
        expandIcon={<ExpandMoreIcon />}
        id="panel1a-header"
      >
        <Grid
          className={classes.heading}
          container
        >
          <Grid
            item
            xs={10}
          >
            <Typography
              className={classes.headingLabel}
              variant="h4"
            >
              {complicationData && complicationData.tipo_complicacao.descricao
                ? complicationData.tipo_complicacao.descricao
                : ''}
            </Typography>
          </Grid>
          <Grid
            item
            xs={2}
          >
            <Typography variant="caption">
              {complicationData ? formatDate(complicationData.data) : ''}
            </Typography>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails className={classes.accordionDetails}>
        <Grid className={classes.gridContainer}>
          <Grid
            item
            xs={12}
          >
            <Typography
              className={classes.formSubtitle}
              variant="h4"
            >
              Data de Complicação
            </Typography>
            <TextField
              className={classes.formInputDate}
              defaultValue={
                complicationData && complicationData.data
                  ? complicationData.data
                  : ''
              }
              InputLabelProps={{
                shrink: true,
              }}
              label="Data"
              name="data_complicacao"
              type="date"
            />
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default DefaultItem;
