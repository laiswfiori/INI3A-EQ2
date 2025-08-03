import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IonPage, IonToolbar, IonContent, IonButton, IonButtons, IonIcon, IonSelect, IonSelectOption, 
  IonSegment, IonSegmentButton, IonLabel, IonRow, IonCol, IonItem, IonSpinner,IonToast } from '@ionic/react';
import { chevronBack,  chevronForward,  chevronDown, documentText, rocket, school, calendar,  flame } from 'ionicons/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';
import './css/darkmode.css';
import Header from '../../components/Header';
import AnimacaoSVG from '../../components/AnimacaoSVG';  
import API from '../../lib/api';
import ThemeManager from '../../utils/ThemeManager';
import '../../utils/css/variaveisCores.css';



interface Atividade {
  id: number;
  topico_id: number;
  materia_id: number;
  titulo: string;
  descricao: string;
  conteudo: string | { tipo: 'texto' | 'imagem' | 'arquivo', valor: string, nome?: string }[];
  status: string;
  tipo: string;
  nivel: string;
  data_entrega?: string;
  created_at: string;
  updated_at: string;
}

export default function () {
  const [menuAberto, setMenuAberto] = useState(false);
  const toggleMenu = () => {
    setMenuAberto(!menuAberto);
  };

  const location = useLocation();
  const hoje = new Date();

  const [currentDate, setCurrentDate] = useState(hoje);
  const [selectedDate, setSelectedDate] = useState(hoje.getDate());
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [viewMode, setViewMode] = useState<'Mês' | 'Semana'>('Mês');

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const gerarAgenda = async () => {
    setLoading(true);

    try {
      const api = new API();
      const response = await api.get("calendarioEstudos");
      setMessage('Agenda gerada com sucesso!');
      setShowToast(true);
    } catch (error) {
      setMessage('Erro ao gerar agenda. Tente novamente!');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days = [];

    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek; i > 0; i--) {
      days.push({ day: prevMonthDays - i + 1, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, isCurrentMonth: true });
    }

    const totalCells = Math.ceil(days.length / 7) * 7;
    let nextMonthDay = 1;
    while (days.length < totalCells) {
      days.push({ day: nextMonthDay, isCurrentMonth: false });
      nextMonthDay++;
    }
    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      const month = direction === 'prev' ? prev.getMonth() - 1 : prev.getMonth() + 1;
      newDate.setMonth(month);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const currentMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  const [atividades, setAtividades] = useState<Atividade[]>([]);

    useEffect(() => {
    const fetchAtividades = async () => {
      try {
        const api = new API();
        const todas = await api.get("atividades");
        
        setAtividades(todas);
      } catch (error) {
        console.error("Erro ao buscar atividades para a agenda:", error);
      }
    };

    fetchAtividades();
  }, []);

  const [eventosAgenda, setEventosAgenda] = useState<any[]>([]);

useEffect(() => {
  const fetchAgendaInteligente = async () => {
    try {
      const api = new API();
      
      const { agenda } = await api.get("/calendarioEstudo"); // ajuste para sua rota correta

      const eventos = agenda.flatMap((item: any) =>
        item.revisoes.map((data: string) => ({
          data,
          materia: item.materia_nome,
          hora_inicio: item.hora_inicio,
          hora_fim: item.hora_fim,
        }))
      );

      setEventosAgenda(eventos);
    } catch (error) {
      console.error("Erro ao carregar a agenda inteligente:", error);
    }
  };

  fetchAgendaInteligente();
}, []);

  type Status = 'não iniciado' | 'em andamento' | 'concluído';

  const contagemStatus: Record<Status, number> = {
    'não iniciado': 0,
    'em andamento': 0,
    'concluído': 0,
  };

  atividades.forEach((a) => {
    if (a.status in contagemStatus) {
      // Asserção de tipo para garantir que a.status é do tipo 'Status'
      contagemStatus[a.status as Status]++;
    }
  });

  const data = [
    { name: 'Não iniciado', value: contagemStatus['não iniciado'] },
    { name: 'Em andamento', value: contagemStatus['em andamento'] },
    { name: 'Concluído', value: contagemStatus['concluído'] },
  ];

  const COLORS = ['#d1250e', '#a18115', '#086e10'];

  const getStatusClass = (status: string) => {
    if (status === 'não iniciado') return 'status-vermelho';
    if (status === 'em andamento') return 'status-amarelo';
    return '';
  };

  const semanaAtual = () => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); 

    const diaSemana = hoje.getDay();
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - diaSemana); 

    const dias = [];

    for (let i = 0; i < 7; i++) {
      const dia = new Date(inicioSemana);
      dia.setDate(inicioSemana.getDate() + i);
      dia.setHours(0, 0, 0, 0); 
      dias.push({
        numero: dia.getDate(),
        nome: dia.toLocaleDateString('pt-BR', { weekday: 'short' }),
        isHoje:
          dia.getTime() === hoje.getTime(),
        ativo: dia.getTime() <= hoje.getTime(), 
      });
    }

    return dias;
  };

  const diasDaSemana = semanaAtual();

  const hojeZero = new Date();
  hojeZero.setHours(0, 0, 0, 0);

  const dataLimite = new Date(hojeZero);
  dataLimite.setDate(dataLimite.getDate() + 7);

  const atividadesFiltradas = atividades.filter((atividade) => {
    if (atividade.status !== 'em andamento' && atividade.status !== 'não iniciado') {
      return false;
    }
    
    if (!atividade.data_entrega) {
      return false;
    }

    const dataEntrega = new Date(atividade.data_entrega);
    dataEntrega.setHours(0, 0, 0, 0);

    return dataEntrega >= hojeZero && dataEntrega <= dataLimite;
  });

  const horarios = Array.from({ length: 24 }, (_, i) => {
    const hora = i;
    return `${hora.toString().padStart(2, '0')}h`;
  });

  return (
    <IonPage>
      <Header />
      <IonContent className="pagAgenda">
        <IonRow className="rowAgenda">
          <h1 className="txtAgenda preto">Calendário</h1>
        </IonRow>
        <IonToolbar className="laranja toolbarD">
          <div className="calendar-controls ion-padding-horizontal">
            <div className="month-navigation">
              <IonButtons>
                <IonButton onClick={() => navigateMonth('prev')} fill="clear" color="light">
                  <IonIcon slot="icon-only" icon={chevronBack} />
                </IonButton>
                <IonButton onClick={() => navigateMonth('next')} fill="clear" color="light">
                  <IonIcon slot="icon-only" icon={chevronForward} />
                </IonButton>
              </IonButtons>
              <span className="month-year-label">{currentMonthYear}</span>
            </div>

            <div className="view-controls">
              <IonSelect
                className="category-select"
                interface="popover"
                placeholder="Categorias"
                value="all"
              >
                <IonSelectOption value="all">Todas as Categorias</IonSelectOption>
                <IonSelectOption value="prova">Prova</IonSelectOption>
                <IonSelectOption value="simulado">Simulado</IonSelectOption>
                <IonSelectOption value="vestibular">Vestibular</IonSelectOption>
                <IonSelectOption value="tarefa">Tarefa</IonSelectOption>
                <IonSelectOption value="aula">Aula</IonSelectOption>
              </IonSelect>
              
              <div className="container">
                <div className="tabs">
                  <input
                    type="radio"
                    name="tabs"
                    id="radio-1"   
                    checked={viewMode === 'Mês'}
                    onChange={() => setViewMode('Mês')}          
                  />
                  <label htmlFor="radio-1" className="tab">Mês</label>

                  <input
                    type="radio"
                    name="tabs"
                    id="radio-2"
                    checked={viewMode === 'Semana'}
                    onChange={() => setViewMode('Semana')}
                  />
                  <label htmlFor="radio-2" className="tab">Semana</label>

                  <span className="glider" />
                </div>
              </div>
            </div>
          </div>
        </IonToolbar>
        <IonToolbar className="laranja toolbarM">
          <div className="month-navigation">
            <div className="btnA">
              <IonButtons>
                <IonButton onClick={() => navigateMonth('prev')} fill="clear" color="light">
                  <IonIcon slot="icon-only" icon={chevronBack} />
                </IonButton>
                <IonButton onClick={() => navigateMonth('next')} fill="clear" color="light">
                  <IonIcon slot="icon-only" icon={chevronForward} />
                </IonButton>
              </IonButtons>
              <span className="month-year-label">{currentMonthYear}</span>
            </div>
           <button
            className={`menu-line ${menuAberto ? 'opened' : ''}`}
            onClick={toggleMenu}
            aria-label="Main Menu"
            aria-expanded={menuAberto}
          >
            <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
              <path className="menu-line menu-line1" d="M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058" />
              <path className="menu-line menu-line2" d="M 20,50 H 80" />
              <path className="menu-line menu-line3" d="M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942" />
            </svg>
          </button>
          </div>
        </IonToolbar>
        {menuAberto && (
          <div className="view-controls laranja">
              <IonSelect
                className="category-select"
                interface="popover"
                placeholder="Categorias"
                value="all"
              >
                <IonSelectOption value="all">Todas as Categorias</IonSelectOption>
                <IonSelectOption value="prova">Prova</IonSelectOption>
                <IonSelectOption value="simulado">Simulado</IonSelectOption>
                <IonSelectOption value="vestibular">Vestibular</IonSelectOption>
                <IonSelectOption value="tarefa">Tarefa</IonSelectOption>
                <IonSelectOption value="aula">Aula</IonSelectOption>
              </IonSelect>
              
              <div className="container">
                <div className="tabs">
                  <input
                    type="radio"
                    name="tabs"
                    id="radio-1"     
                    checked={viewMode === 'Mês'}
                    onChange={() => setViewMode('Mês')}             
                  />
                  <label htmlFor="radio-1" className="tab">Mês</label>

                  <input
                    type="radio"
                    name="tabs"
                    id="radio-2"
                    checked={viewMode === 'Semana'}
                    onChange={() => setViewMode('Semana')}
                  />
                  <label htmlFor="radio-2" className="tab">Semana</label>

                  <span className="glider" />
                </div>
              </div>
            </div>
        )}
        {viewMode === 'Mês' && (
        <div className="calendar-grid-container">
          <div className="calendar-grid days-of-week-header">
            {daysOfWeek.map((day) => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
          </div>

          <div className="calendar-grid">
            {days.map((date, index) => (
              <div
                key={index}
                className={`calendar-day 
                  ${!date.isCurrentMonth ? 'other-month' : ''} 
                  ${date.day === selectedDate && date.isCurrentMonth ? 'selected-day' : ''}
                  ${
                    date.day === hoje.getDate() &&
                    currentDate.getMonth() === hoje.getMonth() &&
                    currentDate.getFullYear() === hoje.getFullYear() &&
                    date.isCurrentMonth
                      ? 'today-highlight'
                      : ''
                  }
                `}
                onClick={() => date.isCurrentMonth && setSelectedDate(date.day)}
              >
                <span className="day-number">{date.day}</span>
                <div className="events-container">
                  {eventosAgenda
                    .filter((evento) => {
                      const eventoDate = new Date(evento.data);
                      return (
                        eventoDate.getDate() === date.day &&
                        eventoDate.getMonth() === currentDate.getMonth() &&
                        eventoDate.getFullYear() === currentDate.getFullYear()
                      );
                    })
                    .map((evento, idx) => (
                      <div key={idx} className="event-tag event-aula">
                        {evento.materia}
                      </div>
                    ))}
                </div>

              </div>
            ))}
          </div>
        </div>
        )}
       {viewMode === 'Semana' && (
          <div className="calendar-grid-container semana">
            <div className="calendar-grid days-of-week-header semana-header">
              <div className="hora-header"></div> 
              {diasDaSemana.map((dia, idx) => (
                <div
                  key={idx}
                  className={`day-header ${dia.isHoje ? 'today-highlight' : ''} ${dia.ativo ? 'dia-ativo' : ''}`}
                  onClick={() => {
                    if (dia.ativo) setSelectedDate(dia.numero);
                  }}
                >
                  <div className="day-number">{dia.numero}</div>
                  <div className="day-name">{dia.nome}</div>
                </div>
              ))}
            </div>
            <div className="calendar-grid semana-horarios">
              {horarios.map((hora, i) => (
                <React.Fragment key={i}>
                  <div className="hora-label">{hora}</div>
                  {diasDaSemana.map((dia, j) => {
  const dataReferencia = new Date();
  dataReferencia.setDate(dia.numero);
  dataReferencia.setHours(0, 0, 0, 0);

  const horaAtual = `${i.toString().padStart(2, '0')}:00`;

  const evento = eventosAgenda.find(ev => {
    const evDate = new Date(ev.data);
    const mesmaData =
      evDate.getDate() === dataReferencia.getDate() &&
      evDate.getMonth() === dataReferencia.getMonth() &&
      evDate.getFullYear() === dataReferencia.getFullYear();

    return mesmaData && ev.hora_inicio.startsWith(horaAtual);
  });

  return (
      
        <div key={j} className="calendar-day semana-dia-hora">
        {evento && (
          <div className="event-tag event-aula">
            {evento.materia}
          </div>
        )}
              </div>
            );
          })}

                </React.Fragment>
              ))}
            </div>
          </div>
        )}
        <div className="legend-container">
            <div className="legend-item"><div className="legend-color event-prova"></div> Provas</div>
            <div className="legend-item"><div className="legend-color event-simulado"></div> Simulados</div>
            <div className="legend-item"><div className="legend-color event-vestibular"></div> Vestibulares</div>
            <div className="legend-item"><div className="legend-color event-tarefa"></div> Tarefas</div>
            <div className="legend-item"><div className="legend-color event-aula"></div> Aulas</div>
        </div>
        <IonRow className="linhaHorizontal"></IonRow>
        <IonRow className="rowAgenda">
          <h1 className="txtAgenda preto">Review semanal</h1>
        </IonRow>
        <IonRow className="rowsRelatorio espacoRelatorio">
            <IonRow className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">{atividades.length}</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={documentText} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Total de atividades</p>
              </IonRow>
            </IonRow>

            <IonRow className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">{atividades.filter(a => a.status === "concluído").length}</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={school} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Total de atividades concluídas</p>
              </IonRow>
            </IonRow>

            <IonRow className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">5</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={rocket} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Total de revisões feitas</p>
              </IonRow>
            </IonRow>
          </IonRow>  
          <IonRow className="rowA rowCentro rowScroll">
            <IonCol className="colAtividades">
              <IonRow className="flexA">
                <h2>Próximas atividades</h2>
                <p className="txtDescricao">Atividades para os próximos 7 dias. Não acumule suas obrigações!</p>
              </IonRow>
              <div className="atividades-scroll">
              <IonRow className="flexRA">
                {atividadesFiltradas.map((atividade) => (
                  <IonItem key={atividade.id} className="materia-item ativAgenda">
                    <IonRow className="containerMateria">
                      <IonCol className="col1MA">
                        <IonIcon icon={calendar} className="iconesTF" />
                        <IonCol className="td tdMat">
                            <h2 className="txtTMat">{atividade.titulo}</h2>
                            <p className="txtDescricao">{atividade.tipo}</p>
                          </IonCol>
                      </IonCol>
                      <IonCol className="col2M">
                        <IonRow>
                          <IonCol id="containerConfig">
                            <IonButton className="config">...</IonButton>
                          </IonCol>
                        </IonRow>
                      </IonCol>

                      <IonRow className="rowA">
                        <IonCol>
                          <p className="txtDescricao">{atividade.descricao}</p>
                        </IonCol>
                      </IonRow>

                      <IonRow className="rowDivsA rowA">
                        <IonCol className={`divAgenda divStatus ${getStatusClass(atividade.status)}`}>
                          <p>{atividade.status}</p>
                        </IonCol>
                        <IonCol className="divAgenda divData">
                          <p>
                            {atividade.data_entrega
                              ? new Date(atividade.data_entrega).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                })
                              : 'Sem data de entrega'}
                          </p>
                        </IonCol>
                      </IonRow>
                    </IonRow>
                  </IonItem>
                ))}
              </IonRow>
              </div>
            </IonCol>
            <IonCol className="colGrafico">
              <IonRow className="flexA sBorda">
                <h2>Progresso de estudo</h2>
                <p className="txtDescricao">Acompanhe seu progresso usando o flashminder.</p>
              </IonRow>
              <div id="grafico"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      dataKey="value"
                      isAnimationActive={true}
                      data={data}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={70}
                      label
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <IonRow className="rowOfensivaD">
                <IonCol className="colOfensiva1">
                  <div className="divOfensiva">
                    <IonIcon icon={flame} className="iconeFogo" />
                    <h3 className="hOfensiva">116 dias</h3>
                    <p className="txtDescricao pOfensiva">Sequência de login</p>
                  </div>
                </IonCol>
                <IonCol className="colOfensiva2">
                  <div className="diasOfensiva">
                    <h3 className="dias1">214</h3>
                    <h4>/365</h4>
                  </div>
                  <IonRow className="barraA">
                    <div className="barraStatusA" style={{ width: `${50}%` }}></div>
                  </IonRow>
                  <div className="date-nav-and-indicators">
                    <div className="date-nav-container">
                      {diasDaSemana.map((dia, index) => (
                        <div
                          key={index}
                          className={`day-item ${dia.isHoje ? 'day-active' : ''}`}
                        >
                          <div className="day-number">{dia.numero}</div>
                          <div className="day-name">{dia.nome}</div>
                        </div>
                      ))}
                    </div>
                    <div className="indicator-container">
                      <div className="indicator-line" />
                      {diasDaSemana.map((dia, index) => (
                        <div
                          key={index}
                          className={`indicator-dot ${dia.ativo ? 'indicator-active' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                </IonCol>
              </IonRow>
              <IonRow className="rowOfensivaT">
                <IonCol className="colOfensiva1">
                  <div className="divOfensiva">
                    <IonIcon icon={flame} className="iconeFogo" />
                    <h3 className="hOfensiva">116 dias</h3>
                    <p className="txtDescricao pOfensiva">Sequência de login</p>
                  </div>
                </IonCol>
                <IonCol className="colOfensiva2">
                  <div className="diasOfensiva">
                    <h3 className="dias1">214</h3>
                    <h4>/365</h4>
                  </div>               
                  <IonRow className="barraA">
                    <div className="barraStatusA" style={{ width: `${50}%` }}></div>
                  </IonRow>
                </IonCol>
                <IonRow className="lA">
                  <div className="date-nav-and-indicators">
                    <div className="date-nav-container">
                      {diasDaSemana.map((dia, index) => (
                        <div
                          key={index}
                          className={`day-item ${dia.isHoje ? 'day-active' : ''}`}
                        >
                          <div className="day-number">{dia.numero}</div>
                          <div className="day-name">{dia.nome}</div>
                        </div>
                      ))}
                    </div>
                    <div className="indicator-container">
                      <div className="indicator-line" />
                      {diasDaSemana.map((dia, index) => (
                        <div
                          key={index}
                          className={`indicator-dot ${dia.ativo ? 'indicator-active' : ''}`}
                        />
                      ))}
                    </div>
                  </div>   
                </IonRow>  
              </IonRow>
            </IonCol>
          </IonRow>  
          <IonRow className="rowAgenda">
                <IonButton
                  fill="solid"
                  color="primary"
                  className="generate-agenda-button"
                  onClick={gerarAgenda}
                  disabled={loading} // Desativa o botão enquanto a agenda está sendo gerada
                >
                  <IonLabel>{loading ? 'Gerando...' : 'Gerar Agenda'}</IonLabel>
                </IonButton>
              </IonRow>
      </IonContent>
    </IonPage>
  );
}