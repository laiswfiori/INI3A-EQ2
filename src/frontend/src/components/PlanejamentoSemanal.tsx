import React from 'react';
import { IonItem, IonButton, IonIcon, IonText } from '@ionic/react';
import { trash } from 'ionicons/icons';

type Dia = 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';

interface PlanejamentoDia {
  dia: Dia;
  materias: { nome: string }[];
  horario: { inicio: string; fim: string };
}

interface Props {
  diasSelecionados: Dia[];
  onChange: (dados: PlanejamentoDia[]) => void;
  onValidityChange?: (isValid: boolean) => void;
}

const PlanejamentoSemanal: React.FC<Props> = ({ diasSelecionados, onChange, onValidityChange }) => {
  const [planejamento, setPlanejamento] = React.useState<PlanejamentoDia[]>([]);
  const [erros, setErros] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    setPlanejamento(prev => {
      const map = new Map(prev.map(p => [p.dia, p]));

      // Adicionar novos dias
      diasSelecionados.forEach(dia => {
        if (!map.has(dia)) {
          map.set(dia, { dia, materias: [{ nome: '' }], horario: { inicio: '', fim: '' } });
        }
      });

      // Remover dias desmarcados
      const atualizados = Array.from(map.values()).filter(p => diasSelecionados.includes(p.dia));
      return atualizados;
    });
  }, [diasSelecionados]);

  React.useEffect(() => {
    onChange(planejamento);
    validate();
  }, [planejamento]);

  const validate = () => {
    const newErros: Record<string, string> = {};
    let valido = true;

    planejamento.forEach(({ dia, materias, horario }) => {
      const hasMateria = materias.some(m => m.nome.trim() !== '');
      const hasHorario = horario.inicio && horario.fim;

      if (!hasMateria || !hasHorario) {
        newErros[dia] = 'Preencha ao menos uma matéria e um horário.';
        valido = false;
      } else if (horario.fim <= horario.inicio) {
        newErros[dia] = 'Hora final deve ser após a hora inicial.';
        valido = false;
      }
    });

    setErros(newErros);
    if (onValidityChange) onValidityChange(valido);
  };

  const updateDia = (dia: Dia, campo: keyof PlanejamentoDia, valor: any) => {
    setPlanejamento(prev =>
      prev.map(p => (p.dia === dia ? { ...p, [campo]: valor } : p))
    );
  };

  return (
    <div>
      {planejamento.map(({ dia, materias, horario }) => (
        <div key={dia}>
          <h3 className="txtDias"><b>{dia}</b></h3>

          <h4 className="tt">Matérias</h4>
          {materias.map((m, idx) => (
            <IonItem key={idx}>
              <input
                className="input2 input"
                placeholder=" Nome da matéria"
                value={m.nome}
                onChange={(e) => {
                  const novas = [...materias];
                  novas[idx].nome = e.target.value;
                  updateDia(dia, 'materias', novas);
                }}
              />
              <IonButton
                className="btn1"
                onClick={() => {
                  const novas = materias.filter((_, i) => i !== idx);
                  updateDia(dia, 'materias', novas);
                }}
              >
                <IonIcon icon={trash} />
              </IonButton>
            </IonItem>
          ))}
          <IonButton className="btn2" onClick={() => updateDia(dia, 'materias', [...materias, { nome: '' }])}>
            + Adicionar matéria
          </IonButton>

          <h4 className="tt">Horário</h4>
          <IonItem>
            <input
              className="input2"
              type="time"
              value={horario.inicio}
              onChange={(e) => updateDia(dia, 'horario', { ...horario, inicio: e.target.value })}
              required
            />
            <span style={{ margin: '0 10px' }}>→</span>
            <input
              className="input2"
              type="time"
              value={horario.fim}
              onChange={(e) => updateDia(dia, 'horario', { ...horario, fim: e.target.value })}
              required
            />
          </IonItem>

          {erros[dia] && <IonText color="danger" style={{ paddingLeft: 8 }}>{erros[dia]}</IonText>}
        </div>
      ))}
    </div>
  );
};

export default PlanejamentoSemanal;
