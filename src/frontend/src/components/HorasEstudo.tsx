import React, { useState, useEffect, useRef } from 'react';
import {
    IonList, IonItem, IonLabel, IonInput, IonButton, IonText, IonIcon
} from '@ionic/react';
import IMask from 'imask';
import { trash } from 'ionicons/icons';
import './css/ui.css';

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
        <h2 className="txtAdd"><b>Selecione seus horários disponíveis:</b></h2>
      <IonList>
        {timeRanges.map((range, idx) => (
          <IonItem key={idx} style={{ flexWrap: 'nowrap' }}>
            <IonLabel className="lbl" position="stacked" style={{marginBottom: "3%"}}>Horário {idx + 1}</IonLabel>
            <div className='divhr'>
              <IonInput 
                className='input'
                placeholder="  Início (09:07)"
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
                className='input'
                placeholder="  Fim (11:15)"
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
              size="small"
              onClick={() => handleRemoveRange(idx)}
              className='btn1'
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

      <IonButton expand="block" onClick={handleAddRange} className='btn2'>
        + Adicionar Horário
      </IonButton>
    </div>
  );
};

export default HorasEstudo;
