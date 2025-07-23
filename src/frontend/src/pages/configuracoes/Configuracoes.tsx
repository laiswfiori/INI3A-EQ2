import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonImg, IonText } from '@ionic/react';
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
  horarios: { inicio: string; fim: string }[];
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
    if (!periodo.dataInicio || !periodo.dataFim) {
      setShowAlert({ show: true, message: 'Preencha o período de estudo (início e fim).' });
      return false;
    }

    if (diasSelecionados.length === 0) {
      setShowAlert({ show: true, message: 'Selecione pelo menos um dia da semana.' });
      return false;
    }

    for (const dia of planejamento) {
      const temMateria = dia.materias.some(m => m.nome.trim() !== '');
      const temHorario = dia.horarios.some(h => h.inicio.trim() !== '' && h.fim.trim() !== '');

      if (!temMateria || !temHorario) {
        setShowAlert({ show: true, message: `Preencha ao menos uma matéria e um horário no dia ${dia.dia}.` });
        return false;
      }

      const combinacoesInvalidas = dia.horarios.some((h, idx) => {
        const materia = dia.materias[idx];
        const materiaPreenchida = materia?.nome.trim() !== '';
        const horarioPreenchido = h?.inicio.trim() !== '' && h?.fim.trim() !== '';
        return (materiaPreenchida && !horarioPreenchido) || (!materiaPreenchida && horarioPreenchido);
      });

      if (combinacoesInvalidas) {
        setShowAlert({ show: true, message: `Cada matéria precisa ter um horário correspondente no dia ${dia.dia}.` });
        return false;
      }
    }

    const materiasCriadas: Record<string, number> = {};
    const api = new API();

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
      const horariosMap = new Map<string, { hora_inicio: string; hora_fim: string; materia_ids: number[] }>();

      for (const materia of dia.materias) {
        const nomeTrim = materia.nome.trim();
        const materiaId = materiasCriadas[nomeTrim];
        if (!materiaId) continue;

        for (const h of dia.horarios) {
          if (!h.inicio.trim() || !h.fim.trim()) continue;

          const key = `${h.inicio}-${h.fim}`;
          const hora_inicio = formatToH_i(h.inicio);
          const hora_fim = formatToH_i(h.fim);

          if (!horariosMap.has(key)) {
            horariosMap.set(key, {
              hora_inicio,
              hora_fim,
              materia_ids: [materiaId],
            });
          } else {
            const item = horariosMap.get(key)!;
            if (!item.materia_ids.includes(materiaId)) {
              item.materia_ids.push(materiaId);
            }
          }
        }
      }

      for (const horario of horariosMap.values()) {
        dias_disponiveis.push({
          dia_semana: normalizarDia(dia.dia),
          ...horario,
        });
      }
    }

    const payload = {
      data_inicio: periodo.dataInicio,
      data_fim: periodo.dataFim,
      dias_disponiveis,
    };

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


