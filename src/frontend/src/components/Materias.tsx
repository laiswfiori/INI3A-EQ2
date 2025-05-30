import React, { useState } from 'react';
import {
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText, 
  IonIcon
} from '@ionic/react';

import { trash } from 'ionicons/icons';

type Materia = {
  name: string;
  error: string;
};

const Materias: React.FC = () => {
  const [materias, setMaterias] = useState<Materia[]>([
    { name: '', error: '' },
  ]);

  function handleAddMateria() {
    setMaterias((old) => [...old, { name: '', error: '' }]);
  }

  function handleChange(idx: number, value: string) {
    const newMaterias = [...materias];
    newMaterias[idx].name = value;
    newMaterias[idx].error = '';
    setMaterias(newMaterias);
  }

  function handleRemoveMateria(idx: number) {
    setMaterias((old) => old.filter((_, i) => i !== idx));
  }

  function validateMateria(idx: number) {
    const materia = materias[idx];
    if (!materia.name.trim()) {
      const newMaterias = [...materias];
      newMaterias[idx].error = 'O nome da matéria não pode estar vazio.';
      setMaterias(newMaterias);
    } else {
      const newMaterias = [...materias];
      newMaterias[idx].error = '';
      setMaterias(newMaterias);
    }
  }

  return (
    <div>
      <h2 style={{ textAlign: 'left', marginBottom: '0px' }}>
        Adicione suas matérias:
      </h2>
      <IonList>
        {materias.map((materia, idx) => (
          <IonItem key={idx} style={{ flexWrap: 'nowrap' }}>
            <IonLabel position="stacked" style={{ marginBottom: '2%' }}>
              Matéria {idx + 1}
            </IonLabel>
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
                placeholder="Nome da matéria"
                value={materia.name}
                onIonChange={(e) => handleChange(idx, e.detail.value ?? '')}
                onIonBlur={() => validateMateria(idx)}
              />
              <IonButton
                color="danger"
                size="small"
                onClick={() => handleRemoveMateria(idx)}
                style={{ marginLeft: '8px', height: '36px' }}
              >
              <IonIcon icon={trash} />
              </IonButton>
            </div>

            {materia.error && (
              <IonText color="danger">{materia.error}</IonText>
            )}
          </IonItem>
        ))}
      </IonList>

      <IonButton expand="block" onClick={handleAddMateria}>
        + Adicionar Matéria
      </IonButton>
    </div>
  );
};

export default Materias;
