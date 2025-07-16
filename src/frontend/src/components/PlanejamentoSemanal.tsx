import React from 'react';
import { IonItem, IonInput, IonButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';

type Dia = 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';

interface PlanejamentoDia {
  dia: Dia;
  materias: { nome: string }[];
  horarios: { inicio: string; fim: string }[];
}

interface Props {
  diasSelecionados: Dia[];
  onChange: (dados: PlanejamentoDia[]) => void;
}

const PlanejamentoSemanal: React.FC<Props> = ({ diasSelecionados, onChange }) => {
  const [planejamento, setPlanejamento] = React.useState<PlanejamentoDia[]>(
    diasSelecionados.map((dia) => ({
      dia,
      materias: [{ nome: '' }],
      horarios: [{ inicio: '', fim: '' }],
    }))
  );

  React.useEffect(() => {
    onChange(planejamento);
  }, [planejamento, onChange]);

  React.useEffect(() => {
    // Atualiza planejamento se mudar os dias selecionados (reseta)
    setPlanejamento(
      diasSelecionados.map((dia) => ({
        dia,
        materias: [{ nome: '' }],
        horarios: [{ inicio: '', fim: '' }],
      }))
    );
  }, [diasSelecionados]);

  const updateDia = (dia: Dia, campo: 'materias' | 'horarios', valor: any) => {
    setPlanejamento((prev) =>
      prev.map((p) =>
        p.dia === dia ? { ...p, [campo]: valor } : p
      )
    );
  };

  return (
    <div>
      {planejamento.map(({ dia, materias, horarios }) => (
        <div key={dia}>
          <h3 className="txtDias"><b>{dia}</b></h3>

          {/* MATÉRIAS */}
          <h4 className="tt">Matérias</h4>
          {materias.map((m, idx) => (
            <IonItem key={idx}>
              <IonInput
                className='input2 input'
                placeholder=" Nome da matéria"
                value={m.nome}
                onIonChange={(e) => {
                  const novas = [...materias];
                  novas[idx].nome = e.detail.value || '';
                  updateDia(dia, 'materias', novas);
                }}
              />
              <IonButton
                className='btn1'
                onClick={() => {
                  const novas = materias.filter((_, i) => i !== idx);
                  updateDia(dia, 'materias', novas);
                }}
              >
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
          <IonButton className='btn2' onClick={() => updateDia(dia, 'materias', [...materias, { nome: '' }])}>
            + Adicionar matéria
          </IonButton>

          {/* HORÁRIOS */}
          <h4 className="tt">Horários</h4>
          {horarios.map((h, idx) => (
            <IonItem key={idx}>
              <input
                className='input2'
                type="time"
                value={h.inicio}
                onChange={(e) => {
                  const novos = [...horarios];
                  novos[idx].inicio = e.target.value;
                  updateDia(dia, 'horarios', novos);
                }}
                required
              />
              <span style={{ margin: '0 10px' }}>→</span>
              <input
                className='input2'
                type="time"
                value={h.fim}
                onChange={(e) => {
                  const novos = [...horarios];
                  novos[idx].fim = e.target.value;
                  updateDia(dia, 'horarios', novos);
                }}
                required
              />
              <IonButton
                className='btn1'
                onClick={() => {
                  const novos = horarios.filter((_, i) => i !== idx);
                  updateDia(dia, 'horarios', novos);
                }}
              >
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
          <IonButton className='btn2' onClick={() => updateDia(dia, 'horarios', [...horarios, { inicio: '', fim: '' }])}>
            + Adicionar horário
          </IonButton>
        </div>
      ))}
    </div>
  );
};

export default PlanejamentoSemanal;
