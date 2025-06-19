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
import './css/ui.css';
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
      <h2 className="txtAdd">
        <b>Adicione suas matérias:</b>
      </h2>
      <IonList>
        {materias.map((materia, idx) => (
          <IonItem key={idx} style={{ flexWrap: 'nowrap' }}>
            <IonLabel position="stacked" style={{ marginBottom: '3%'}}>
              Matéria {idx + 1}
            </IonLabel>
            <div className='divhr'>
              <IonInput
                className='input2'
                placeholder="  Nome da matéria"
                value={materia.name}
                onIonChange={(e) => handleChange(idx, e.detail.value ?? '')}
                onIonBlur={() => validateMateria(idx)}
              />
              <IonButton
                size="small"
                onClick={() => handleRemoveMateria(idx)}
                className='btn1'
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

      <IonButton expand="block" onClick={handleAddMateria} className='btn2'>
        + Adicionar Matéria
      </IonButton>
    </div>
  );
};

export default Materias;
