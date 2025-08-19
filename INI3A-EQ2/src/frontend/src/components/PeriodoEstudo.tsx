import React, { useEffect, useState } from 'react';
import { IonItem, IonLabel, IonInput, IonText } from '@ionic/react';
import './css/ui.css';

interface Props {
  onChange?: (periodo: { dataInicio: string; dataFim: string }) => void;
  onValidityChange?: (isValid: boolean) => void;
}

const PeriodoEstudo: React.FC<Props> = ({ onChange, onValidityChange }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [error, setError] = useState('');

  const hojeISO = new Date().toISOString().split('T')[0];

  useEffect(() => {
    validate();
    if (onChange) onChange({ dataInicio: start, dataFim: end });
  }, [start, end]);

  function validate() {
    let mensagemErro = '';

    if (!start || !end) {
      mensagemErro = 'As datas precisam ser preenchidas.';
    } else {
      // Comparar strings YYYY-MM-DD diretamente:
      if (start < hojeISO) {
        mensagemErro = 'Data de início não pode ser anterior ao dia atual.';
      } else if (end <= start) {
        mensagemErro = 'Data de término precisa ser após a de início.';
      }
    }

    setError(mensagemErro);
    if (onValidityChange) onValidityChange(mensagemErro === '');
  }

  return (
    <div>
      <h2 className="txtAddPE"><b>Selecione o período de estudo:</b></h2>

      <IonItem>
        <IonLabel className="lbl" position="stacked">Data de Início</IonLabel>
        <IonInput
          type="date"
          value={start}
          onIonChange={(e) => setStart(e.detail.value!)}
          min={hojeISO}  // Permite data de início igual ou maior que hoje
          max="2100-12-31"
        />
      </IonItem>

      <IonItem>
        <IonLabel className="lbl" position="stacked">Data de Término</IonLabel>
        <IonInput
          type="date"
          value={end}
          onIonChange={(e) => setEnd(e.detail.value!)}
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
