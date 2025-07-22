import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonInput, IonItem, IonLabel, IonCheckbox, IonButton, IonAlert } from '@ionic/react';
import { getUserProfile, getAgendaConfiguracoes, saveAgendaConfiguracoes, getMaterias } from '../../lib/endpoints';
import { formatToH_i } from '../../utils/formatters';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  biography: string;
}

interface Materia {
  id: number;
  nome: string;
}

interface HorarioEstudo {
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  materias: { id: number }[];
}

const Teste: React.FC = () => {
  const [periodoEstudo, setPeriodoEstudo] = useState({ inicio: '', fim: '' });
  const [showAlert, setShowAlert] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const [horariosDeEstudo, setHorariosDeEstudo] = useState<HorarioEstudo[]>([]);
  const [diasSemana] = useState(['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']);
  const [userData, setUserData] = useState<User | null>(null);
  const [materiasDisponiveis, setMateriasDisponiveis] = useState<Materia[]>([]);

  const handleDiaToggle = (dia: string) => {
    setHorariosDeEstudo(prev => {
      const existe = prev.some(h => h.dia_semana === dia);
      if (existe) {
        return prev.filter(h => h.dia_semana !== dia);
      } else {
        const novoHorario: HorarioEstudo = { dia_semana: dia, hora_inicio: '', hora_fim: '', materias: [] };
        return [...prev, novoHorario].sort((a, b) => diasSemana.indexOf(a.dia_semana) - diasSemana.indexOf(b.dia_semana));
      }
    });
  };

  const handleTimeChange = (dia: string, tipo: 'inicio' | 'fim', valor: string) => {
    setHorariosDeEstudo(prev =>
      prev.map(h =>
        h.dia_semana === dia ? { ...h, [tipo === 'inicio' ? 'hora_inicio' : 'hora_fim']: valor } : h
      )
    );
  };

  const handleMateriaSelect = (dia: string, materiaId: number) => {
    setHorariosDeEstudo(prev =>
      prev.map(h => {
        if (h.dia_semana === dia) {
          const materiaExiste = h.materias.some(m => m.id === materiaId);
          const novasMaterias = materiaExiste
            ? h.materias.filter(m => m.id !== materiaId)
            : [...h.materias, { id: materiaId }];
          return { ...h, materias: novasMaterias };
        }
        return h;
      })
    );
  };

  const handleSalvar = async () => {
    if (horariosDeEstudo.some(h => !h.hora_inicio || !h.hora_fim)) {
      setShowAlert({ show: true, message: 'Preencha o horário de início e fim para todos os dias.' });
      return;
    }

    if (!periodoEstudo.inicio || !periodoEstudo.fim) {
      setShowAlert({ show: true, message: 'Preencha o período total de estudo.' });
      return;
    }

    const diasSemMateria = horariosDeEstudo.filter(h => h.materias.length === 0);
    if (diasSemMateria.length > 0) {
      const nomesDias = diasSemMateria.map(d => d.dia_semana).join(', ');
      setShowAlert({ show: true, message: `Selecione pelo menos uma matéria para: ${nomesDias}.` });
      return;
    }

    const dias_disponiveis = horariosDeEstudo.map(h => ({
      dia_semana: h.dia_semana.toLowerCase().replace('-feira', '').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      hora_inicio: formatToH_i(h.hora_inicio),
      hora_fim: formatToH_i(h.hora_fim),
      materia_ids: h.materias.map(m => m.id),
    }));

    const payload = {
      data_inicio: periodoEstudo.inicio,
      data_fim: periodoEstudo.fim,
      dias_disponiveis,
    };

    try {
      await saveAgendaConfiguracoes(payload);
      setShowAlert({ show: true, message: 'Configurações salvas com sucesso!' });
    } catch (error: any) {
      if (error.response) {
        const data = await error.response.json();
        setShowAlert({ show: true, message: data.message || 'Erro ao salvar as configurações.' });
      } else {
        setShowAlert({ show: true, message: 'Erro ao salvar as configurações.' });
      }
    }
  };

  useEffect(() => {
    const carregarMaterias = async () => {
      try {
        const materias = await getMaterias();
        setMateriasDisponiveis(materias);
      } catch (error) {}
    };
    carregarMaterias();
  }, []);

  useEffect(() => {
    const normalizarDia = (dia: string): string => {
      switch (dia.toLowerCase()) {
        case 'segunda': return 'Segunda-feira';
        case 'terca': return 'Terça-feira';
        case 'quarta': return 'Quarta-feira';
        case 'quinta': return 'Quinta-feira';
        case 'sexta': return 'Sexta-feira';
        case 'sabado': return 'Sábado';
        default: return dia;
      }
    };

    const carregarConfiguracoes = async () => {
      try {
        const user = await getUserProfile();
        setUserData(user);

        const config = await getAgendaConfiguracoes();

        if (config?.dias_disponiveis?.length > 0) {
          const dias: HorarioEstudo[] = config.dias_disponiveis.map((dia: any) => ({
            dia_semana: normalizarDia(dia.dia_semana),
            hora_inicio: dia.hora_inicio,
            hora_fim: dia.hora_fim,
            materias: dia.materias ? dia.materias.map((m: any) => ({ id: m.id })) : []
          }));

          setHorariosDeEstudo(dias.sort((a, b) => diasSemana.indexOf(a.dia_semana) - diasSemana.indexOf(b.dia_semana)));
          setPeriodoEstudo({
            inicio: config.data_inicio || '',
            fim: config.data_fim || ''
          });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações da agenda:", error);
      }
    };

    carregarConfiguracoes();
  }, []);

  return (
    <IonPage>
      <IonContent>
        <IonRow>
          <IonCol>
            <h1 id="h1Titulo">Configurações avançadas de estudo</h1>

            <p>Período total de estudo:</p>
            <IonRow>
              <IonCol>
                <IonInput
                  label="Data de Início"
                  labelPlacement="stacked"
                  type="date"
                  value={periodoEstudo.inicio}
                  onIonChange={e => setPeriodoEstudo({ ...periodoEstudo, inicio: e.detail.value! })}
                />
              </IonCol>
              <IonCol>
                <IonInput
                  label="Data de Término"
                  labelPlacement="stacked"
                  type="date"
                  value={periodoEstudo.fim}
                  onIonChange={e => setPeriodoEstudo({ ...periodoEstudo, fim: e.detail.value! })}
                />
              </IonCol>
            </IonRow>

            <p>1. Selecione os dias que você pode estudar:</p>
            <IonRow>
              {diasSemana.map(dia => (
                <IonCol size="12" size-sm="6" size-md="4" key={dia}>
                  <IonItem lines="none">
                    <IonCheckbox
                      checked={horariosDeEstudo.some(h => h.dia_semana === dia)}
                      onIonChange={() => handleDiaToggle(dia)}
                    />
                    <IonLabel>{dia}</IonLabel>
                  </IonItem>
                </IonCol>
              ))}
            </IonRow>

            {horariosDeEstudo.map((horario, index) => (
              <div key={index}>
                <h3>{horario.dia_semana}</h3>

                <p>2. Defina o horário:</p>
                <IonRow>
                  <IonCol>
                    <IonInput
                      label="Início"
                      labelPlacement="stacked"
                      type="time"
                      value={horario.hora_inicio || ''}
                      onIonChange={e => handleTimeChange(horario.dia_semana, 'inicio', e.detail.value || '')}
                    />
                  </IonCol>
                  <IonCol>
                    <IonInput
                      label="Fim"
                      labelPlacement="stacked"
                      type="time"
                      value={horario.hora_fim || ''}
                      onIonChange={e => handleTimeChange(horario.dia_semana, 'fim', e.detail.value || '')}
                    />
                  </IonCol>
                </IonRow>

                <p>3. Selecione as matérias:</p>
                {materiasDisponiveis.map(materia => {
                  const isSelected = horario.materias.some(m => m.id === materia.id);

                  return (
                    <IonRow key={materia.id}>
                      <IonCol>
                        <IonItem lines="none">
                          <IonCheckbox
                            checked={isSelected}
                            onIonChange={() => handleMateriaSelect(horario.dia_semana, materia.id)}
                          />
                          <IonLabel>{materia.nome}</IonLabel>
                        </IonItem>
                      </IonCol>
                    </IonRow>
                  );
                })}
              </div>
            ))}

            {horariosDeEstudo.length > 0 && (
              <IonButton expand="full" onClick={handleSalvar}>
                Salvar Configurações de Estudo
              </IonButton>
            )}
          </IonCol>
        </IonRow>

        <IonAlert
          isOpen={showAlert.show}
          onDidDismiss={() => setShowAlert({ show: false, message: '' })}
          header={'Atenção!'}
          message={showAlert.message}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Teste;
