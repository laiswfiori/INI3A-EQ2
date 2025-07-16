import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonButton, IonImg, IonText } from '@ionic/react';
import './css/ui.css';
import './css/layout.css';
import './css/geral.css';
import MultiSelectDias from '../../components/MultiSelectDias';
import PlanejamentoSemanal from '../../components/PlanejamentoSemanal';
import PeriodoEstudo from '../../components/PeriodoEstudo';

type Dia = 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';

interface PlanejamentoDia {
  dia: Dia;
  materias: { nome: string }[];
  horarios: { inicio: string; fim: string }[];
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

  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
  };

  const navHome = () => {
    history.push('/pagInicial/home');
  };

  const salvar = () => {
    if (validarPlanejamento()) {
      // Salvar os dados se quiser
      history.push(isAuthenticated() ? '/perfil/perfil' : '/logincadastro/logincadastro');
    }
  };

  const validarPlanejamento = (): boolean => {
    if (diasSelecionados.length === 0) {
      setErro('Selecione pelo menos um dia da semana.');
      return false;
    }

    if (!periodo.dataInicio || !periodo.dataFim) {
      setErro('Preencha a data de início e a data de término do período de estudo.');
      return false;
    }

    for (const dia of planejamento) {
      const temMateria = dia.materias.some((m) => m.nome.trim() !== '');
      const temHorario = dia.horarios.some((h) => h.inicio.trim() !== '' && h.fim.trim() !== '');

      if (!temMateria || !temHorario) {
        setErro(`Preencha pelo menos uma matéria e um horário no dia ${dia.dia}.`);
        return false;
      }
    }

    setErro(null);
    return true;
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
