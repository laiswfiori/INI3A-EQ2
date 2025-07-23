import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonInput, IonItem, IonLabel, IonCheckbox, IonButton, IonAlert, IonText } from '@ionic/react';
import { getUserProfile, getAgendaConfiguracoes, saveAgendaConfiguracoes, getMaterias } from '../../lib/endpoints';
import { formatToH_i } from '../../utils/formatters';
import API from '../../lib/api'; 

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  biography: string;
}

// Interface Materia existente (vindo do backend)
interface MateriaExistente {
  id: number;
  nome: string;
}

interface MateriaLocal {
  id?: number; 
  nome: string;
}

interface HorarioEstudo {
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  materias: MateriaLocal[]; 
}

const Teste: React.FC = () => {
  const [periodoEstudo, setPeriodoEstudo] = useState({ inicio: '', fim: '' });
  const [showAlert, setShowAlert] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const [horariosDeEstudo, setHorariosDeEstudo] = useState<HorarioEstudo[]>([]);
  const [diasSemana] = useState(['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']); // Adicionei domingo
  const [userData, setUserData] = useState<User | null>(null);
  const [materiasDisponiveis, setMateriasDisponiveis] = useState<MateriaExistente[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 

  const handleDiaToggle = (dia: string) => {
    setHorariosDeEstudo(prev => {
      const existe = prev.some(h => h.dia_semana === dia);
      if (existe) {
        return prev.filter(h => h.dia_semana !== dia);
      } else {
        const novoHorario: HorarioEstudo = { dia_semana: dia, hora_inicio: '', hora_fim: '', materias: [{ nome: '' }] }; // Começa com um campo de matéria vazio
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

  const handleMateriaChange = (dia: string, index: number, nomeMateria: string) => {
    setHorariosDeEstudo(prev =>
      prev.map(h => {
        if (h.dia_semana === dia) {
          const novasMaterias = [...h.materias];
          novasMaterias[index] = { ...novasMaterias[index], nome: nomeMateria };

          const ultimaMateria = novasMaterias[novasMaterias.length - 1];
          const isLastEmpty = ultimaMateria.nome.trim() === '';
          const isLastExisting = materiasDisponiveis.some(m => m.nome.toLowerCase() === ultimaMateria.nome.toLowerCase());

          if (!isLastEmpty && !isLastExisting && index === novasMaterias.length - 1) {
            novasMaterias.push({ nome: '' });
          }

          const filteredMaterias = novasMaterias.filter((m, idx) => m.nome.trim() !== '' || idx === novasMaterias.length - 1);
          if (filteredMaterias.length === 0) { 
            filteredMaterias.push({ nome: '' });
          }

          return { ...h, materias: filteredMaterias };
        }
        return h;
      })
    );
  };

  const handleAddMateriaField = (dia: string) => {
    setHorariosDeEstudo(prev =>
      prev.map(h => {
        if (h.dia_semana === dia) {
          const novasMaterias = [...h.materias];
          novasMaterias.push({ nome: '' });
          return { ...h, materias: novasMaterias };
        }
        return h;
      })
    );
  };

  const handleRemoveMateriaField = (dia: string, index: number) => {
    setHorariosDeEstudo(prev =>
      prev.map(h => {
        if (h.dia_semana === dia) {
          const novasMaterias = h.materias.filter((_, idx) => idx !== index);
          if (novasMaterias.length === 0) { 
            novasMaterias.push({ nome: '' });
          }
          return { ...h, materias: novasMaterias };
        }
        return h;
      })
    );
  };

  const handleSalvar = async () => {
    setLoading(true);
    if (horariosDeEstudo.some(h => !h.hora_inicio || !h.hora_fim)) {
      setShowAlert({ show: true, message: 'Preencha o horário de início e fim para todos os dias selecionados.' });
      setLoading(false);
      return;
    }

    if (!periodoEstudo.inicio || !periodoEstudo.fim) {
      setShowAlert({ show: true, message: 'Preencha o período total de estudo (data de início e fim).' });
      setLoading(false);
      return;
    }

    for (const dia of horariosDeEstudo) {
      const inicio = dia.hora_inicio;
      const fim = dia.hora_fim;
      if (inicio && fim && inicio >= fim) {
        setShowAlert({ show: true, message: `A hora de término deve ser posterior à hora de início para ${dia.dia_semana}.` });
        setLoading(false);
        return;
      }
    }

    // valida matérias preenchidas
    const diasSemMateriaPreenchida = horariosDeEstudo.filter(h => h.materias.every(m => m.nome.trim() === ''));
    if (diasSemMateriaPreenchida.length > 0) {
      const nomesDias = diasSemMateriaPreenchida.map(d => d.dia_semana).join(', ');
      setShowAlert({ show: true, message: `Preencha pelo menos uma matéria para os dias: ${nomesDias}.` });
      setLoading(false);
      return;
    }

    // p criar novas matérias antes de salvar a agenda
    const materiasParaCriar: { nome: string }[] = [];
    const materiasMap: Record<string, number> = {}; 

    materiasDisponiveis.forEach(m => {
      materiasMap[m.nome.toLowerCase()] = m.id;
    });

    for (const horario of horariosDeEstudo) {
      for (const materia of horario.materias) {
        const nomeFormatado = materia.nome.trim().toLowerCase();
        if (nomeFormatado && !materiasMap[nomeFormatado]) {
          materiasParaCriar.push({ nome: materia.nome.trim() });
          materiasMap[nomeFormatado] = -1;
        }
      }
    }

    const api = new API(); 

    try {
      for (const novaMateriaData of materiasParaCriar) {
        const response = await api.post('materias', { nome: novaMateriaData.nome });
        if (response && response.id) { 
          materiasMap[novaMateriaData.nome.toLowerCase()] = response.id;
        } else {
          throw new Error(`Erro ao criar a matéria: ${novaMateriaData.nome}. Resposta inválida.`);
        }
      }

      const dias_disponiveis = horariosDeEstudo.map(h => {
        const materia_ids = h.materias
          .filter(m => m.nome.trim() !== '') 
          .map(m => {
            const id = materiasMap[m.nome.trim().toLowerCase()];
            if (id === undefined || id === -1) {
              throw new Error(`ID da matéria "${m.nome}" não encontrado após criação/busca.`);
            }
            return id;
          });

        return {
          dia_semana: h.dia_semana.toLowerCase().replace('-feira', '').normalize('NFD').replace(/[̀-ͯ]/g, ''),
          hora_inicio: formatToH_i(h.hora_inicio),
          hora_fim: formatToH_i(h.hora_fim),
          materia_ids,
        };
      }).filter(dia => dia.materia_ids.length > 0); // filtra os dias sem matérias válidas após a checagem

      const payload = {
        data_inicio: periodoEstudo.inicio,
        data_fim: periodoEstudo.fim,
        dias_disponiveis,
      };

      await saveAgendaConfiguracoes(payload);
      setShowAlert({ show: true, message: 'Configurações salvas com sucesso!' });
      // Recarrega as matérias disponíveis após salvar, para que as novas apareçam
      const updatedMaterias = await getMaterias();
      setMateriasDisponiveis(updatedMaterias);

    } catch (error: any) {
      console.error("Erro completo ao salvar/criar:", error); // Log mais detalhado
      let errorMessage = 'Erro ao salvar as configurações.';
      if (error.response) {
        const data = await error.response.json();
        errorMessage = data.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setShowAlert({ show: true, message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const carregarTudo = async () => {
      setLoading(true);
      try {
        // carrega matérias disponíveis
        const materias = await getMaterias();
        setMateriasDisponiveis(materias);

        //carrega perfil do user
        const user = await getUserProfile();
        setUserData(user);

        // carrega configurações da agenda
        const config = await getAgendaConfiguracoes();

        if (config?.dias_disponiveis?.length > 0) {
          const dias: HorarioEstudo[] = config.dias_disponiveis.map((dia: any) => ({
            dia_semana: normalizarDia(dia.dia_semana),
            hora_inicio: dia.hora_inicio,
            hora_fim: dia.hora_fim,
            materias: dia.materias && dia.materias.length > 0 ? dia.materias.map((m: any) => ({ id: m.id, nome: m.nome })) : [{ nome: '' }]
          }));

          setHorariosDeEstudo(dias.sort((a, b) => diasSemana.indexOf(a.dia_semana) - diasSemana.indexOf(b.dia_semana)));
          setPeriodoEstudo({
            inicio: config.data_inicio || '',
            fim: config.data_fim || ''
          });
        }
      } catch (error) {
        console.error("Erro ao carregar dados iniciais:", error);
        setShowAlert({ show: true, message: 'Erro ao carregar dados iniciais. Tente novamente.' });
      } finally {
        setLoading(false);
      }
    };

    carregarTudo();
  }, []);

  const normalizarDia = (dia: string): string => {
    switch (dia.toLowerCase()) {
      case 'segunda': return 'Segunda-feira';
      case 'terca': return 'Terça-feira';
      case 'quarta': return 'Quarta-feira';
      case 'quinta': return 'Quinta-feira';
      case 'sexta': return 'Sexta-feira';
      case 'sabado': return 'Sábado';
      case 'domingo': return 'Domingo'; 
      default: return dia;
    }
  };

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

            {loading ? (
              <IonText>Carregando configurações...</IonText>
            ) : (
              horariosDeEstudo.map((horario, index) => (
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

                  <p>3. Selecione ou crie matérias:</p>
                  {materiasDisponiveis.length > 0 && (
                    <IonCol>
                      <IonLabel>Materias existentes:</IonLabel>
                      {materiasDisponiveis.map(materia => {
                        const isSelected = horario.materias.some(m => m.id === materia.id);
                        return (
                          <IonItem key={`exist-${materia.id}-${horario.dia_semana}`} lines="none">
                            <IonCheckbox
                              checked={isSelected}
                              onIonChange={() => {
                                setHorariosDeEstudo(prev =>
                                  prev.map(h => {
                                    if (h.dia_semana === horario.dia_semana) {
                                      const novasMaterias = isSelected
                                        ? h.materias.filter(m => m.id !== materia.id)
                                        : [...h.materias, { id: materia.id, nome: materia.nome }];
                                      return { ...h, materias: novasMaterias };
                                    }
                                    return h;
                                  })
                                );
                              }}
                            />
                            <IonLabel>{materia.nome}</IonLabel>
                          </IonItem>
                        );
                      })}
                    </IonCol>
                  )}

                  <IonCol className="ion-margin-top">
                    <IonLabel>Novas Matérias (digite e pressione Enter ou clique em Adicionar):</IonLabel>
                    {horario.materias.map((materia, materiaIndex) => (
                      <IonItem key={`new-${horario.dia_semana}-${materiaIndex}`} lines="none">
                        <IonInput
                          placeholder="Nome da matéria"
                          value={materia.nome}
                          onIonChange={e => handleMateriaChange(horario.dia_semana, materiaIndex, e.detail.value || '')}
                        />
                        {horario.materias.length > 1 && (
                          <IonButton fill="clear" onClick={() => handleRemoveMateriaField(horario.dia_semana, materiaIndex)}>
                            Remover
                          </IonButton>
                        )}
                      </IonItem>
                    ))}
                    <IonButton expand="full" fill="outline" onClick={() => handleAddMateriaField(horario.dia_semana)}>
                      Adicionar Nova Matéria
                    </IonButton>
                  </IonCol>
                </div>
              ))
            )}

            {horariosDeEstudo.length > 0 && (
              <IonButton expand="full" onClick={handleSalvar} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Configurações de Estudo'}
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