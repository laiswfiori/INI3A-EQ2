import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonImg, IonText, IonAlert } from '@ionic/react';
import './css/ui.css';
import './css/layout.css';
import './css/geral.css';
import MultiSelectDias from '../../components/MultiSelectDias';
import PlanejamentoSemanal from '../../components/PlanejamentoSemanal';
import PeriodoEstudo from '../../components/PeriodoEstudo';
import { saveAgendaConfiguracoes } from '../../lib/endpoints';
import { formatToH_i } from '../../utils/formatters';
import API from '../../lib/api';

type Dia = 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';

interface PlanejamentoDia {
  dia: string;
  materias: Materia[];
  horario: { inicio: string; fim: string };
}

interface Materia{
  nome: string;
  id?: number;
}

interface Periodo {
  dataInicio: string;
  dataFim: string;
}

const Configuracoes: React.FC = () => {
  const history = useHistory();

  const [diasSelecionados, setDiasSelecionados] = useState<Dia[]>([]);
  const [planejamento, setPlanejamento] = useState<PlanejamentoDia[]>([]);
  const [periodo, setPeriodo] = useState<Periodo>({ dataInicio: '', dataFim: '' });
  const [erro, setErro] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const navHome = () => {
    history.push('/pagInicial/home');
  };

const salvar = async () => {
  const sucesso = await validarPlanejamento();
  if (sucesso) {
    history.push(isAuthenticated() ? '/perfil/perfil' : '/logincadastro/logincadastro');
  }
};

const validarPlanejamento = async () => {
  // Verificar se o período de estudo foi preenchido
  if (!periodo.dataInicio || !periodo.dataFim) {
    setShowAlert({ show: true, message: 'Preencha o período de estudo (início e fim).' });
    return false;
  }

  // Verificar se pelo menos um dia da semana foi selecionado
  if (diasSelecionados.length === 0) {
    setShowAlert({ show: true, message: 'Selecione pelo menos um dia da semana.' });
    return false;
  }

  // Verificar se cada dia tem ao menos uma matéria e um horário
  for (const dia of planejamento) {
    const temMateria = dia.materias.some(m => m.nome.trim() !== '');
    const temHorario = dia.horario.inicio.trim() !== '' && dia.horario.fim.trim() !== '';

    if (!temMateria || !temHorario) {
      setShowAlert({ show: true, message: `Preencha ao menos uma matéria e um horário no dia ${dia.dia}.` });
      return false;
  }

    const materiasPreenchidas = dia.materias.filter(m => m.nome.trim() !== '');
    if (materiasPreenchidas.length === 0 && (dia.horario.inicio.trim() !== '' && dia.horario.fim.trim() !== '')) {
      setShowAlert({ show: true, message: `Horário preenchido sem matéria no dia ${dia.dia}.` });
      return false;
    }
    if (materiasPreenchidas.length > 0 && (dia.horario.inicio.trim() === '' || dia.horario.fim.trim() === '')) {
      setShowAlert({ show: true, message: `Matéria preenchida sem horário no dia ${dia.dia}.` });
      return false;
    }
    }

  // Agora, verificamos se as matérias precisam ser criadas e se tudo está correto
  const materiasCriadas: Record<string, number> = {};
  const api = new API();

  // Criar as matérias se necessário
  for (const dia of planejamento) {
    for (const materia of dia.materias) {
      const nomeTrim = materia.nome.trim();
      if (!nomeTrim) continue;

      if (!materiasCriadas[nomeTrim]) {
        try {
          const data = await api.post('materias', { nome: nomeTrim });
          materiasCriadas[nomeTrim] = data.id;
        } catch (e) {
          setShowAlert({ show: true, message: `Erro ao criar matéria: ${nomeTrim}` });
          return false;
        }
      }
    }
  }

  // Normalizar o nome dos dias da semana
  const normalizarDia = (dia: string) => {
    const mapa: Record<string, string> = {
      'segunda-feira': 'segunda',
      'segunda': 'segunda',
      'terca-feira': 'terca',
      'terça-feira': 'terca',
      'terca': 'terca',
      'terça': 'terca',
      'quarta-feira': 'quarta',
      'quarta': 'quarta',
      'quinta-feira': 'quinta',
      'quinta': 'quinta',
      'sexta-feira': 'sexta',
      'sexta': 'sexta',
      'sabado': 'sabado',
      'sábado': 'sabado',
      'domingo': 'domingo',
    };
    return mapa[dia.toLowerCase()] || dia.toLowerCase();
  };

  const dias_disponiveis: any[] = [];

  for (const dia of planejamento) {
    const { inicio, fim } = dia.horario;

    // Pula se o horário não estiver preenchido
    if (!inicio.trim() || !fim.trim()) continue;

    const hora_inicio = formatToH_i(inicio);
    const hora_fim = formatToH_i(fim);

    const materia_ids: number[] = [];

    for (const materia of dia.materias) {
      const nomeTrim = materia.nome.trim();
      const materiaId = materiasCriadas[nomeTrim];
      if (materiaId && !materia_ids.includes(materiaId)) {
        materia_ids.push(materiaId);
      }
    }

    // Pula se não tiver matérias válidas
    if (materia_ids.length === 0) continue;

    dias_disponiveis.push({
      dia_semana: normalizarDia(dia.dia),
      hora_inicio,
      hora_fim,
      materia_ids,
    });
  }

  const payload = {
    data_inicio: periodo.dataInicio,
    data_fim: periodo.dataFim,
    dias_disponiveis,
  };

  // Aqui está a requisição para salvar os dados, será chamada somente após todas as validações passarem
  try {
    await saveAgendaConfiguracoes(payload);
    setShowAlert({ show: true, message: 'Planejamento salvo com sucesso!' });
    return true;
  } catch (error: any) {
    if (error.response) {
      try {
        const data = await error.response.json();
        setShowAlert({ show: true, message: data.message || 'Erro ao salvar as configurações.' });
      } catch {
        setShowAlert({ show: true, message: 'Erro desconhecido na resposta da API.' });
      }
    } else if (error.message) {
      setShowAlert({ show: true, message: error.message });
    } else {
      setShowAlert({ show: true, message: 'Erro ao conectar-se à API.' });
    }
    return false;
  }
};

  return (
    <IonPage>
      <IonContent>
        <IonAlert
          isOpen={showAlert.show}
          onDidDismiss={() => setShowAlert({ show: false, message: '' })}
          header="Atenção"
          message={showAlert.message}
          buttons={['OK']}
        />

        <div id="body">
          <div className="bubble-background">
            <div className="bubble bubble1"></div>
            <div className="bubble bubble2"></div>
            <div className="bubble bubble3"></div>
            <div className="bubble bubble4"></div>
            <div className="bubble bubble5"></div>
          </div>

          <div className="configuracoes-container">
            <div className="div111">
              <div className='scroll'>
                <div className='grid1'>
                  <div className="voltarHome">
                    <h4 className="h444" onClick={navHome}>🠔Home</h4>
                    <IonImg className="img" src="/imgs/logoSemFundo.png" alt="Ir para pagInicial" onClick={navHome} />
                  </div>

                  <div className="avisos">
                    <h4 className="h333 h41"><b>Seu cadastro foi efetivado. Você está quase lá!</b></h4>
                  </div>
                </div>

                <h3 className="h111"><b>Configure seu plano de estudos</b></h3>
                <h4 className="h444 h41">*Lembre-se de criar um plano que se adeque à sua rotina.*</h4>

                <div>
                  <MultiSelectDias value={diasSelecionados} onChange={setDiasSelecionados} />

                  {diasSelecionados.length > 0 && (
                    <PlanejamentoSemanal diasSelecionados={diasSelecionados} onChange={setPlanejamento} />
                  )}

                  <PeriodoEstudo onChange={setPeriodo} />

                  <hr style={{ marginTop: '20px', borderColor: '#ccc' }} />

                  {erro && (
                    <IonText color="danger">
                      <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{erro}</p>
                    </IonText>
                  )}

                  <IonButton className="botao" onClick={salvar}>Salvar</IonButton>
                  <IonButton className="botao" onClick={navHome}>Configurar mais tarde</IonButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Configuracoes;


