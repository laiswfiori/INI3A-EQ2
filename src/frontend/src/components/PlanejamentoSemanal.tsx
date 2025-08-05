import React from 'react';
import { IonItem, IonInput, IonButton, IonIcon } from '@ionic/react';
import { trash } from 'ionicons/icons';

type Dia = 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';

interface PlanejamentoDia {
  dia: Dia;
  materias: { nome: string }[];
  horario: { inicio: string; fim: string }; // apenas um único horário por dia
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
      horario: { inicio: '', fim: '' },
    }))
  );

  // Atualiza o planejamento quando há mudanças
  React.useEffect(() => {
    onChange(planejamento);
  }, [planejamento, onChange]);

  // Atualiza/reinicia o planejamento se mudar os dias selecionados
  React.useEffect(() => {
    setPlanejamento(
      diasSelecionados.map((dia) => ({
        dia,
        materias: [{ nome: '' }],
        horario: { inicio: '', fim: '' },
      }))
    );
  }, [diasSelecionados]);

  const updateDia = (dia: Dia, campo: keyof PlanejamentoDia, valor: any) => {
    setPlanejamento((prev) =>
      prev.map((p) =>
        p.dia === dia ? { ...p, [campo]: valor } : p
      )
    );
  };

  return (
    <div>
      {planejamento.map(({ dia, materias, horario }) => (
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

          {/* HORÁRIO ÚNICO */}
          <h4 className="tt">Horário</h4>
          <IonItem>
            <input
              className='input2'
              type="time"
              value={horario.inicio}
              onChange={(e) => {
                updateDia(dia, 'horario', { ...horario, inicio: e.target.value });
              }}
              required
            />
            <span style={{ margin: '0 10px' }}>→</span>
            <input
              className='input2'
              type="time"
              value={horario.fim}
              onChange={(e) => {
                updateDia(dia, 'horario', { ...horario, fim: e.target.value });
              }}
              required
            />
          </IonItem>
        </div>
      ))}
    </div>
  );
};

export default PlanejamentoSemanal;
