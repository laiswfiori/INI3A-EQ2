import React from 'react';
import {useState, useEffect } from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonIcon, useIonRouter, IonInput, IonItem, IonLabel, IonCheckbox, IonButton} from '@ionic/react';
import { desktop } from 'ionicons/icons';
import { getUserProfile, updateUserProfile, changeUserPassword, deleteUserAccount, getAgendaConfiguracoes, saveAgendaConfiguracoes, getMaterias } from '../../lib/endpoints';

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
  const ionRouter = useIonRouter();

  const [periodoEstudo, setPeriodoEstudo] = useState({
    inicio: '',
    fim: ''
});
const [showAlert, setShowAlert] = useState<{show: boolean, message: string}>({show: false, message: ''});
const [horariosDeEstudo, setHorariosDeEstudo] = useState<HorarioEstudo[]>([]);
const [diasSemana, setDiasSemana] = useState(['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']);
    const [userData, setUserData] = useState<User | null>(null);

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
      h.dia_semana === dia
        ? { ...h, [tipo === 'inicio' ? 'hora_inicio' : 'hora_fim']: valor }
        : h
    )
  );
};
      const [materiasDisponiveis, setMateriasDisponiveis] = useState<Materia[]>([]);
  
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

  // Monta o array dias_disponiveis conforme esperado
  const dias_disponiveis = horariosDeEstudo.map(h => ({
    dia_semana: h.dia_semana.toLowerCase().replace('-feira', '').trim(),
    hora_inicio: formatToH_i(h.hora_inicio),
    hora_fim: formatToH_i(h.hora_fim),
    materia_id: h.materias.length > 0 ? h.materias[0].id : undefined,
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
  console.error('Erro ao salvar:', error);
  if (error.data) {
    console.error('Detalhes do erro:', error.data);
  }
  setShowAlert({ show: true, message: error.data?.message || 'Erro ao salvar as configurações.' });
}
};

useEffect(() => {
  const carregarMaterias = async () => {
    try {
      const materias = await getMaterias();
      setMateriasDisponiveis(materias);
    } catch (error) {
      console.error("Erro ao carregar matérias:", error);
    }
  };
  carregarMaterias();
}, []);

useEffect(() => {
  const carregarConfiguracoes = async () => {
    try {
      const user = await getUserProfile();
      setUserData(user);

      const config = await getAgendaConfiguracoes();

      if (config?.dias_disponiveis) {
        const dias: HorarioEstudo[] = config.dias_disponiveis.map((dia: any) => ({
        dia_semana: dia.dia_semana.charAt(0).toUpperCase() + dia.dia_semana.slice(1) + '-feira',
        hora_inicio: dia.hora_inicio.trim(),  // <-- trim aqui
        hora_fim: dia.hora_fim.trim(),        // <-- trim aqui
        materias: dia.materia_id ? [{ id: dia.materia_id }] : []
      }));
        setHorariosDeEstudo(dias);
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

function formatToH_i(time: string): string {
  if (!time) return '';
  const [hourStr, minuteStr] = time.split(':');
  if (!hourStr || !minuteStr) return '';
  
  // Remove zero à esquerda da hora, parseando para número
  const hour = parseInt(hourStr, 10);
  // Mantém minuto como está, com zero à esquerda se tiver
  return `${hour}:${minuteStr}`;
}


  return (
    <IonPage >
      <IonContent>
        <IonRow >
           <IonCol>
                   <h1 id="h1Titulo">Configurações avançadas de estudo</h1>
                   
                   {/* Novo Campo: Período Total de Estudo */}
                   <p  style={{ marginTop: '20px', fontWeight: 'bold' }}>Período total de estudo:</p>
                   <IonRow>
                       <IonCol>
                           <IonInput 
                               label="Data de Início" 
                               labelPlacement="stacked" 
                               type="date" 
                               value={periodoEstudo.inicio} 
                               onIonChange={e => setPeriodoEstudo({...periodoEstudo, inicio: e.detail.value!})} 
                           />
                       </IonCol>
                       <IonCol>
                           <IonInput 
                               label="Data de Término" 
                               labelPlacement="stacked" 
                               type="date" 
                               value={periodoEstudo.fim} 
                               onIonChange={e => setPeriodoEstudo({...periodoEstudo, fim: e.detail.value!})} 
                           />
                       </IonCol>
                   </IonRow>
           
                   {/* Passo 1: Seleção de Dias */}
                   <p style={{ marginTop: '20px', fontWeight: 'bold' }}>1. Selecione os dias que você pode estudar:</p>
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
           
                   {/* Passo 2 e 3: Renderização dos blocos de configuração */}
                   {horariosDeEstudo.map((horario, index) => (
                   <div key={index}  style={{ border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                       <h3 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', marginBottom: '16px' }}>{horario.dia_semana}</h3>
                       
                       {/* Definição de Horário */}
                       <p style={{ fontWeight: 'bold' }}>2. Defina o horário:</p>
                       <IonRow >
                       <IonCol>
                           <IonInput 
                              label="Início" 
                              labelPlacement="stacked" 
                              type="time" 
                              value={horario.hora_inicio || ''} 
                              onIonChange={e => {
                                console.log('hora_inicio:', e.detail.value);
                                handleTimeChange(horario.dia_semana, 'inicio', e.detail.value || '');
                              }}
                           />
                       </IonCol>
                       <IonCol>
                           <IonInput 
                              label="Fim" 
                              labelPlacement="stacked" 
                              type="time" 
                              value={horario.hora_fim || ''} 
                              onIonChange={e => {
                                console.log('hora_fim:', e.detail.value);
                                handleTimeChange(horario.dia_semana, 'fim', e.detail.value || '');
                              }}
                            />
                       </IonCol>
                       </IonRow>
           
                       {/* Seleção de Matérias (sem preferencial) */}
                       <p style={{ fontWeight: 'bold' }}>3. Selecione as matérias:</p>
                       {materiasDisponiveis.map(materia => {
                       const isSelected = horario.materias.some(m => m.id === materia.id);
           
                       return (
                           <IonRow key={materia.id} >
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
           
                   {/* Botão para Salvar as Configurações */}
                   {horariosDeEstudo.length > 0 && (
                   <IonButton expand="full" onClick={handleSalvar}>
                       Salvar Configurações de Estudo
                   </IonButton>
                   )}
               </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Teste;