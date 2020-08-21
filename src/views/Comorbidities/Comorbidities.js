import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import DoneIcon from '@material-ui/icons/Done';
import Add from '@material-ui/icons/Add';
import {
  Typography,
  Button,
  Paper,
  Chip,
  FormGroup,
  FormLabel,
  TextField,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@material-ui/core';

import CardComorbirdades from './CardComorbidades';
import PatientInfo from 'components/PatientInfo';
import useStyles from './styles';
import CustonBreadcrumbs from 'components/CustonBreadcrumbs';

import { useComorbidade } from 'context/ComorbidadesContext';

import CheckBoxCard from './CheckBoxCard';

const Comorbidities = () => {
  const classes = useStyles();

  const {
    addCard,
    cards,
    handleOrgaoId,
    handleCorticosteroideId,
    removeOrgaos,
    removeCorticosteroides
  } = useComorbidade();

  const [diabetes, setDiabetes] = useState(false);
  const [obesidade, setObesidade] = useState(false);
  const [hipertensao, setHipertensao] = useState(false);
  const [hiv, setHiv] = useState(false);
  const [tuberculose, setTuberculose] = useState(false);
  const [renal, setRenal] = useState(false);
  const [transplantado, setTransplantado] = useState('');
  const [corticosteroide, setCorticosteroide] = useState('');

  const [gestacao, setGestacao] = useState('');
  const [semanasGestacao, setSemanasGestacao] = useState(0);

  const [puerperio, setPuerperio] = useState('');
  const [semanasPuerperio, setSemanasPuerperio] = useState(0);


  const [selectedField, setSelectedField] = useState({});

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        <CustonBreadcrumbs
          links={[
            { label: 'Meus pacientes', route: '/meus-pacientes' },
            { label: 'Categorias', route: '/categorias' },
            {
              label: 'Comorbidades / condições iniciais',
              route: '/categorias/comorbidades',
            },
          ]}
        />
      </div>
      <div className={classes.titleWrapper}>
        <Typography variant="h1">Comorbidades / condições clínicas</Typography>
        <div className={classes.patientWrapper}>
          <PatientInfo />
          <Button
            className={classes.buttonSave}
            color="secondary"
            type="submit"
            variant="contained"
          >
            Salvar
          </Button>
        </div>
      </div>
      <Paper className={classes.paper}>
        <div className={classes.control}>
          <Typography
            className={classes.label}
            variant="h6"
          >
            Selecione as doenças que o paciente apresenta
          </Typography>
          <div className={classes.chipWrapper}>
            <Chip
              clickable
              color={diabetes ? 'primary' : 'default'}
              icon={diabetes ? <DoneIcon /> : null}
              label="Diabetes"
              onClick={() => {
                setDiabetes(prevDiabetes => !prevDiabetes);
              }}
            />
            <Chip
              clickable
              color={obesidade ? 'primary' : 'default'}
              icon={obesidade ? <DoneIcon /> : null}
              label="Obesidade"
              onClick={() => {
                setObesidade(prevObesidade => !prevObesidade);
              }}
            />
            <Chip
              clickable
              color={hipertensao ? 'primary' : 'default'}
              icon={hipertensao ? <DoneIcon /> : null}
              label="hipertensao"
              onClick={() => {
                setHipertensao(prevHipertensao => !prevHipertensao);
              }}
            />
            <Chip
              clickable
              color={hiv ? 'primary' : 'default'}
              icon={hiv ? <DoneIcon /> : null}
              label="hiv"
              onClick={() => {
                setHiv(prevHiv => !prevHiv);
              }}
            />
            <Chip
              clickable
              color={tuberculose ? 'primary' : 'default'}
              icon={tuberculose ? <DoneIcon /> : null}
              label="tuberculose"
              onClick={() => {
                setTuberculose(prevTuberculose => !prevTuberculose);
              }}
            />
            <Chip
              clickable
              color={renal ? 'primary' : 'default'}
              icon={renal ? <DoneIcon /> : null}
              label="renal"
              onClick={() => {
                setRenal(prevRenal => !prevRenal);
              }}
            />
          </div>
        </div>

        <div className={classes.control}>
          <Typography
            className={classes.label}
            variant="h6"
          >
            Acrescente outras doenças que o paciente apresenta
          </Typography>
          <div className={classes.buttonWrapper}>
            <TextField
              className={classes.textFieldWithButton}
              label="Escolher tipo de doença"
              select
              variant="filled"
            >
              {tiposDoenca.map(({ id, descricao }) => (
                <MenuItem
                  key={id}
                  onClick={() => setSelectedField({ id, descricao })}
                  value={id}
                >
                  {descricao}
                </MenuItem>
              ))}
            </TextField>
            <Button
              className={classes.buttonAdd}
              color="secondary"
              onClick={() => addCard(selectedField, doencas)}
              startIcon={<Add />}
              type="button"
              variant="contained"
            >
              Adicionar
            </Button>
          </div>
        </div>

        {cards.map(card => (
          <CardComorbirdades
            card={card}
            key={card.id}
          />
        ))}
        
        <FormGroup
          className={classes.control}
          component="fieldset"
        >
          <FormLabel
            className={classes.label}
            component="legend"
          >
            Transplantado
          </FormLabel>
          <RadioGroup
            aria-label="transplantado"
            name="transplantado"
            onChange={(event) => setTransplantado(event.target.value)}
            value={transplantado}
          >
            <div className={classes.radiosWrapper}>
              <FormControlLabel
                control={<Radio />}
                label="Sim"
                value="sim"
              />
              <FormControlLabel
                control={<Radio />}
                label="Não"
                onClick={removeOrgaos}
                value="nao"
              />
            </div>
          </RadioGroup>
            
        </FormGroup>

        {transplantado === 'sim' &&
          <FormGroup
            className={classes.control}
            component="fieldset"
          >
            <FormLabel
              className={classes.label}
              component="legend"
            >
              Quais órgãos?
            </FormLabel>
            <div className={classes.orgaosWrapper}>
              {orgaos.map(orgao =>
                <CheckBoxCard
                  handleArray={handleOrgaoId}
                  id={orgao.id}
                  label={orgao.descricao}
                />
              )}
            </div>
              
          </FormGroup>
        }
        
        <FormGroup
          className={classes.control}
          component="fieldset"
        >
          <FormLabel
            className={classes.label}
            component="legend"
          >
            Usou corticosteroides por mais de 15 dias?
          </FormLabel>
          <RadioGroup
            aria-label="corticosteroides"
            name="corticosteroides"
            onChange={(event) => setCorticosteroide(event.target.value)}
            value={corticosteroide}
          >
            <div className={classes.radiosWrapper}>
              <FormControlLabel
                control={<Radio />}
                label="Sim"
                value="sim"
              />
              <FormControlLabel
                control={<Radio />}
                label="Não"
                onClick={removeCorticosteroides}
                value="nao"
              />
            </div>
          </RadioGroup>
        </FormGroup>

        {corticosteroide === 'sim' &&
          <FormGroup
            className={classes.control}
            component="fieldset"
          >
            <FormLabel
              className={classes.label}
              component="legend"
            >
              Quais corticosteroides?
            </FormLabel>
            <div className={classes.orgaosWrapper}>
              {corticosteroides.map(corticosteroide =>
                <CheckBoxCard
                  handleArray={handleCorticosteroideId}
                  id={corticosteroide.id}
                  label={corticosteroide.descricao}
                />
              )}
            </div>
              
          </FormGroup>
        }

        <FormGroup
          className={classes.control}
          component="fieldset"
        >
          <FormLabel
            className={classes.label}
            component="legend"
          >
            Gestação
          </FormLabel>
          <RadioGroup
            aria-label="gestacao"
            name="gestacao"
            onChange={(event) => setGestacao(event.target.value)}
            value={gestacao}
          >
            <div className={classes.radiosWrapper}>
              <FormControlLabel
                control={<Radio />}
                label="Sim"
                value="sim"
              />
              <FormControlLabel
                control={<Radio />}
                label="Não"
                value="nao"
              />
            </div>
          </RadioGroup>
        </FormGroup>

        {gestacao === 'sim' &&
          <FormGroup
            className={classes.control}
            component="fieldset"
          >
            <FormLabel
              className={classes.label}
              component="legend"
            >
              Há quantas semanas?
            </FormLabel>
            <TextField
              onChange={(event) => setSemanasGestacao(event.target.value)}
              type="number"
              value={semanasGestacao}
            />
              
          </FormGroup>
        }

        <FormGroup
          className={classes.control}
          component="fieldset"
        >
          <FormLabel
            className={classes.label}
            component="legend"
          >
            Puerpério
          </FormLabel>
          <RadioGroup
            aria-label="puerperio"
            name="puerperio"
            onChange={(event) => setPuerperio(event.target.value)}
            value={puerperio}
          >
            <div className={classes.radiosWrapper}>
              <FormControlLabel
                control={<Radio />}
                label="Sim"
                value="sim"
              />
              <FormControlLabel
                control={<Radio />}
                label="Não"
                onClick={() => setSemanasPuerperio(0)}
                value="nao"
              />
            </div>
          </RadioGroup>
        </FormGroup>

        {puerperio === 'sim' &&
          <FormGroup
            className={classes.control}
            component="fieldset"
          >
            <FormLabel
              className={classes.label}
              component="legend"
            >
              Há quantas semanas?
            </FormLabel>
            <TextField
              onChange={(event) => setSemanasPuerperio(event.target.value)}
              type="number"
              value={semanasPuerperio}
            />
              
          </FormGroup>
        }

        <FormGroup
          className={classes.control}
          component="fieldset"
        >
          <FormLabel
            className={classes.label}
            component="legend"
          >
            Outras condições
          </FormLabel>
          <div className={classes.buttonWrapper}>
            <TextField
              className={classes.textFieldWithButton}
              label="Outras condições"
              variant="filled"
            />
            <Button
              className={classes.buttonAdd}
              color="secondary"
              startIcon={<Add />}
              type="button"
              variant="contained"
            >
              Adicionar
            </Button>
          </div>
        </FormGroup>

        <FormGroup component="fieldset">
          <FormLabel
            className={classes.label}
            component="legend"
          >
            Medicações de uso contínuo
          </FormLabel>
          <div className={classes.buttonWrapper}>
            <TextField
              className={classes.textFieldWithButton}
              label="Medicações de uso contínuo"
              variant="filled"
            />
            <Button
              className={classes.buttonAdd}
              color="secondary"
              startIcon={<Add />}
              type="button"
              variant="contained"
            >
              Adicionar
            </Button>
          </div>
        </FormGroup>
      </Paper>
    </div>
  );
};

export default withRouter(Comorbidities);

const orgaos = [
  {
    id: 1,
    descricao: 'Coracao',
  },
  {
    id: 2,
    descricao: 'Estômago',
  },
  {
    id: 3,
    descricao: 'Fígado',
  }
];

const tiposDoenca = [
  {
    id: 1,
    descricao: 'Doença cardíaca',
  },
  {
    id: 2,
    descricao: 'Doença vascular periférica',
  },
  {
    id: 3,
    descricao: 'Doença pulmonar',
  },
  {
    id: 4,
    descricao: 'Doença reumatológica',
  },
  {
    id: 5,
    descricao: 'Neoplasia',
  },
  {
    id: 6,
    descricao: 'Doença autoimune',
  },
  {
    id: 7,
    descricao: 'Doença renal crônica',
  },
  {
    id: 8,
    descricao: 'Doença hepática crônica',
  },
  {
    id: 9,
    descricao: 'Doença neurológica',
  },
  {
    id: 10,
    descricao: 'Doença psiquiátrica',
  },
];

const doencas = [
  {
    id: 1,
    tipo_doenca_id: 1,
    descricao: 'Doença arterial coronariana',
  },
  {
    id: 2,
    tipo_doenca_id: 1,
    descricao: 'Insuficiência cardíaca congestiva',
  },
  {
    id: 3,
    tipo_doenca_id: 1,
    descricao: 'Arritmia cardíaca',
  },
  {
    id: 4,
    tipo_doenca_id: 1,
    descricao: 'Cardiopatia não-especificada',
  },
  {
    id: 5,
    tipo_doenca_id: 2,
    descricao: 'Insuficiencia venosa',
  },
  {
    id: 7,
    tipo_doenca_id: 3,
    descricao: 'Doença pulmonar obstrutiva crônica',
  },
  {
    id: 8,
    tipo_doenca_id: 3,
    descricao: 'Asma',
  },
];

const corticosteroides = [
  {
    id: 1,
    descricao: 'Prednisona > 40 mg dia',
  },
  {
    id: 2,
    descricao: 'Hidrocortisona > 160 mg dia',
  },
  {
    id: 3,
    descricao: 'Metilprednisolona > 32 mg dia',
  },
  {
    id: 4,
    descricao: 'Dexametasona > 6 mg dia',
  }
];
