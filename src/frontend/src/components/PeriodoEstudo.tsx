import React, { useState, useEffect } from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonText,
} from '@ionic/react';
import './css/ui.css';

interface Props {
  onChange?: (periodo: { dataInicio: string; dataFim: string }) => void;
}

const PeriodoEstudo: React.FC<Props> = ({ onChange }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');

  const hojeISO = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

  function validate() {
    const dataInicio = new Date(start);
    const dataFim = new Date(end);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    if (!start || !end) {
      setError('Preencha ambas as datas.');
      return;
    }

    if (isNaN(dataInicio.getTime()) || isNaN(dataFim.getTime())) {
      setError('Datas inválidas.');
      return;
    }

    if (dataFim < hoje) {
      setError('A data de término não pode ser no passado.');
      return;
    }

    if (dataFim <= dataInicio) {
      setError('A data de término deve ser após a de início.');
      return;
    }

    setError('');
  }

  useEffect(() => {
    if (onChange) {
      onChange({ dataInicio: start, dataFim: end });
    }
  }, [start, end, onChange]);

  return (
    <div>
      <h2 className="txtAddPE"><b>Selecione o período de estudo:</b></h2>

      <IonItem>
        <IonLabel className="lbl" position="stacked">Data de Início</IonLabel>
        <IonInput
          type="date"
          value={start}
          onIonChange={(e) => setStart(e.detail.value!)}
          onIonBlur={validate}
          max="2100-12-31"
        />
      </IonItem>

      <IonItem>
        <IonLabel className="lbl" position="stacked">Data de Término</IonLabel>
        <IonInput
          type="date"
          value={end}
          onIonChange={(e) => setEnd(e.detail.value!)}
          onIonBlur={validate}
          min={hojeISO}
        />
      </IonItem>

      {error && (
        <IonText color="danger" style={{ paddingLeft: 16 }}>
          {error}
        </IonText>
      )}
    </div>
  );
};

export default PeriodoEstudo;
