import React, { useState, useEffect, useRef } from 'react';
import {
    IonContent, IonList, IonItem, IonLabel, IonInput, IonButton, IonText, IonIcon
} from '@ionic/react';
import IMask from 'imask';
import { trash } from 'ionicons/icons';

type TimeRange = {
  start: string;
  end: string;
  error: string;
};

const maskOptions = {
  mask: 'HH:MM',
  blocks: {
    HH: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 23,
      maxLength: 2,
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 0,
      to: 59,
      maxLength: 2,
    },
  },
};

function timeToMinutes(t: string) {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

const HorasEstudo: React.FC = () => {
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
    { start: '', end: '', error: '' },
  ]);

  const startRefs = useRef<Array<HTMLInputElement | null>>([]);
  const endRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    timeRanges.forEach((_, i) => {
      if (startRefs.current[i]) {
        IMask(startRefs.current[i]!, maskOptions);
      }
      if (endRefs.current[i]) {
        IMask(endRefs.current[i]!, maskOptions);
      }
    });
  }, [timeRanges.length]);

  function handleAddRange() {
    setTimeRanges((old) => [...old, { start: '', end: '', error: '' }]);
  }

  function handleChange(idx: number, field: 'start' | 'end', value: string) {
    const newRanges = [...timeRanges];
    newRanges[idx][field] = value;
    newRanges[idx].error = '';
    setTimeRanges(newRanges);
  }

  function handleRemoveRange(idx: number) {
    setTimeRanges((old) => old.filter((_, i) => i !== idx));
  }

  function validateRange(idx: number) {
    const { start, end } = timeRanges[idx];
    const isStartValid = /^([01]\d|2[0-3]):([0-5]\d)$/.test(start);
    const isEndValid = /^([01]\d|2[0-3]):([0-5]\d)$/.test(end);

    if (!isStartValid || !isEndValid) {
      const newRanges = [...timeRanges];
      newRanges[idx].error = 'Formato inválido. Use HH:mm.';
      setTimeRanges(newRanges);
      return;
    }

    if (timeToMinutes(start) >= timeToMinutes(end)) {
      const newRanges = [...timeRanges];
      newRanges[idx].error = 'Horário de início deve ser antes do fim.';
      setTimeRanges(newRanges);
      return;
    }

    const newRanges = [...timeRanges];
    newRanges[idx].error = '';
    setTimeRanges(newRanges);
  }

  return (
    <div>
        <h2 style={{textAlign: 'left', marginBottom: "0px"}}>Selecione seus horários disponíveis:</h2>
      <IonList>
        {timeRanges.map((range, idx) => (
          <IonItem key={idx} style={{ flexWrap: 'nowrap' }}>
            <IonLabel position="stacked" style={{marginBottom: "2%"}}>Horário {idx + 1}</IonLabel>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '300px',
                flexWrap: 'nowrap',
              }}
            >
              <IonInput 
              style={{
                    border: '2px solid #003366', // azul escuro
                    borderRadius: '4px',
                    padding: '6px 8px',
                }}
                placeholder="Início (09:07)"
                value={range.start}
                onIonChange={(e) =>
                  handleChange(idx, 'start', e.detail.value ?? '')
                }
                onIonBlur={() => validateRange(idx)}
                ref={(el) => {
                  startRefs.current[idx] = el?.querySelector('input') || null;
                }}
              />
              <IonInput
              style={{
                    border: '2px solid #003366', 
                    borderRadius: '4px',
                }}
                placeholder="Fim (11:15)"
                value={range.end}
                onIonChange={(e) =>
                  handleChange(idx, 'end', e.detail.value ?? '')
                }
                onIonBlur={() => validateRange(idx)}
                ref={(el) => {
                  endRefs.current[idx] = el?.querySelector('input') || null;
                }}
              />
              <IonButton
              color="danger"
              size="small"
              onClick={() => handleRemoveRange(idx)}
              style={{ marginLeft: '8px', height: '36px' }}
            >
            <IonIcon icon={trash} />
            </IonButton>
            </div>

            {range.error && (
              <IonText color="danger">
                {range.error}
              </IonText>
            )}
          </IonItem>
        ))}
      </IonList>

      <IonButton expand="block" onClick={handleAddRange}>
        + Adicionar Horário
      </IonButton>
    </div>
  );
};

export default HorasEstudo;
