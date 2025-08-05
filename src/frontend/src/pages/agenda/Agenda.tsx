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

const coresIniciais = (() => {
  try {
    const raw = localStorage.getItem('coresMaterias');
    console.log('Cores carregadas do localStorage:', raw); // Verifique se as cores estão sendo lidas corretamente.
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.error('Erro ao ler cores do localStorage:', error);
    return {};
  }
})();

const [coresMaterias, setCoresMaterias] = useState<{ [key: string]: string }>(coresIniciais);
const [isCoresCarregadas, setIsCoresCarregadas] = useState(true);

useEffect(() => {
  const raw = localStorage.getItem('coresMaterias');
  console.log('Cores carregadas do localStorage no useEffect:', raw); // Verifique a leitura de cores aqui
  if (raw) {
    setCoresMaterias(JSON.parse(raw));
  }
}, []);
  
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const [materiaSelecionada, setMateriaSelecionada] = useState<string>('all');


  useEffect(() => {
    const coresSalvas = localStorage.getItem('coresMaterias');
    if (coresSalvas) {
       console.log('Cores carregadas do localStorage:', JSON.parse(coresSalvas)); 
      setCoresMaterias(JSON.parse(coresSalvas));
    }
    setIsCoresCarregadas(true);
  }, []);

  const normalizarNomeMateria = (nome: string) => {
    const nomeUpper = nome.trim().toUpperCase();
  
    const mapa: { [key: string]: string } = {
      'PORTUGUÊS': 'm1',
      'PORTUGUES': 'm1',
      'LITERATURA': 'm1',
      'INGLÊS': 'm2',
      'INGLES': 'm2',
      'ESPANHOL': 'm2',
      'ARTES': 'm3',
      'HISTÓRIA': 'm4',
      'HISTORIA': 'm4',
      'FILOSOFIA': 'm5',
      'SOCIOLOGIA': 'm6',
      'GEOGRAFIA': 'm7',
      'BIOLOGIA': 'm8',
      'QUÍMICA': 'm9',
      'QUIMICA': 'm9',
      'FÍSICA': 'm10',
      'FISICA': 'm10',
      'MATEMÁTICA': 'm11',
      'MATEMATICA': 'm11'
    };
  
    const classe = mapa[nomeUpper] || '';
    return { nome: nomeUpper, classe };
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

  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  const days = [];

  // Dias do mês anterior (para completar a primeira semana)
  const prevMonth = new Date(year, month - 1, 1);
  const prevMonthDays = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek; i > 0; i--) {
    days.push({ day: prevMonthDays - i + 1, isCurrentMonth: false });
  }

  // Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({ day, isCurrentMonth: true });
  }

  // Dias do próximo mês (para completar a última semana)
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
      
      const { agenda } = await api.get("/calendarioEstudos"); 

      const eventos = agenda.flatMap((item: any) =>
        item.revisoes.map((data: string) => ({
          data,
          materia: item.materia_nome,
          materia_id: item.materia_id, // Aqui, materia_id deve ser número
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
  return {
    hora: hora.toString().padStart(2, '0'),
    label: `${hora.toString().padStart(2, '0')}h`
  };
});

const getEventosPorDiaEHora = (dia: number, hora: string) => {
  return eventosAgenda.filter(evento => {
    const eventoDate = new Date(evento.data);
    return (
      eventoDate.getDate() === dia &&
      eventoDate.getMonth() === hoje.getMonth() &&
      eventoDate.getFullYear() === hoje.getFullYear() &&
      evento.hora_inicio.startsWith(`${hora}:`)
    );
  });
};

const fetchAgendaInteligente = async () => {
  try {
    const api = new API();
    const { agenda } = await api.get("calendarioEstudos");

    const eventos = agenda.flatMap((item: any) =>
      item.revisoes.map((data: string) => ({
        data,
        materia: item.materia_nome,
        materia_id: item.materia_id,
        hora_inicio: item.hora_inicio,
        hora_fim: item.hora_fim,
      }))
    );

    setEventosAgenda(eventos);
  } catch (error) {
    console.error("Erro ao carregar a agenda inteligente:", error);
  }
};

useEffect(() => {
  fetchAgendaInteligente();
}, []);

const parseDbDate = (dateString: string) => {
  if (!dateString) return new Date();
  
  const datePart = dateString.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);
  
  return new Date(Date.UTC(year, month - 1, day, 12)); // Meio-dia UTC evita problemas de dia anterior
};

// Na visualização semanal, ajuste o filtro:
const eventosNestaHora = eventosAgenda.filter(evento => {
  const eventoDate = parseDbDate(evento.data);
  const diaCorreto = new Date(eventoDate);
  
  // Ajuste para comparar com os dias da semana corretamente
  return (
    diaCorreto.getMonth() === hoje.getMonth() &&
    diaCorreto.getFullYear() === hoje.getFullYear()
  );
});

const materiasUnicas = Array.from(new Set(eventosAgenda.map(evento => evento.materia))).sort();



  return (
    <IonPage>
      <Header />
      <IonContent className="bodyAG">
        <IonRow className="rowAgenda">
          <h1 className="txtAgenda pDarkmode">Calendário</h1>
        </IonRow>
        <IonToolbar className="laranja toolbarD">
          <div className="calendar-controls ion-padding-horizontal">
            <div className={`month-navigation ${viewMode === 'Semana' ? 'hidden-month-nav' : ''}`}>
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
                placeholder="Matérias"
                value={materiaSelecionada}
                onIonChange={(e) => setMateriaSelecionada(e.detail.value)}
              >
                <IonSelectOption value="all">Todas as matérias</IonSelectOption>
                {materiasUnicas.map((materia, index) => (
                  <IonSelectOption key={index} value={materia}>
                    {materia}
                  </IonSelectOption>
                ))}
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
          <div className="rowMobileMonth">
            <div className={`month-navigation ${viewMode === 'Semana' ? 'hidden-month-nav' : ''}`}>
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
              </div>
            <div className="classBtnMenu">
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
          </div>          
        </IonToolbar>
        {menuAberto && (
          <div className="view-controls laranja">
              <IonSelect
                className="category-select"
                interface="popover"
                placeholder="Matérias"
                value={materiaSelecionada}
                onIonChange={(e) => setMateriaSelecionada(e.detail.value)}
              >
                <IonSelectOption value="all">Todas as matérias</IonSelectOption>
                {materiasUnicas.map((materia, index) => (
                  <IonSelectOption key={index} value={materia}>
                    {materia}
                  </IonSelectOption>
                ))}
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
      {days.map((date, index) => {
        // Filtra eventos APENAS para dias do mês atual
        const currentDayEvents = date.isCurrentMonth 
          ? eventosAgenda.filter((evento) => {
              if (!evento.data) return false;
              const eventoDate = parseDbDate(evento.data);
              return (
                eventoDate.getDate() === date.day &&
                eventoDate.getMonth() === currentDate.getMonth() &&
                eventoDate.getFullYear() === currentDate.getFullYear()
              );
            })
          : [];

        return (
          <div
            key={index}
            className={`calendar-day ${!date.isCurrentMonth ? 'other-month' : ''}
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
            onMouseEnter={() => setHoveredDay(date.day)}
            onMouseLeave={() => setHoveredDay(null)}
          >
            <span className="day-number">{date.day}</span>
            
            {date.isCurrentMonth && isCoresCarregadas && (
              <div className="events-container">
                {currentDayEvents.slice(0, 2).map((evento, idx) => {
                  const materiaNome = evento.materia || '';
                  const materiaId = evento.materia_id ? String(evento.materia_id) : ''; 
                  const corSalva = materiaId ? coresMaterias[materiaId] : undefined;

                  console.log(`Evento ${materiaNome} (ID: ${materiaId}) - evento completo:`, evento);
                  console.log(`Cor salva para o ID ${materiaId}: ${corSalva}`); 

                  const { classe } = normalizarNomeMateria(materiaNome);

                  return (
                    <div 
                      key={`${date.day}-${idx}`}
                      className={`event-tag ${corSalva ? '' : classe}`}
                      style={{ backgroundColor: corSalva || undefined }} 
                    >
                      <div className="event-title">{materiaNome || 'Evento'}</div>
                      <div className="event-time">
                        {evento.hora_inicio} - {evento.hora_fim}
                      </div>
                    </div>
                  );
                })}
                {currentDayEvents.length > 2 && (
                  <div className="more-events">+{currentDayEvents.length - 2}</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  </div>
)}
{viewMode === 'Semana' && (
  <div className="calendar-grid-container semana">
    <div className="calendar-grid days-of-week-header semana-header">
      <div className="hora-header"></div>
      {diasDaSemana.map((diaSemana, idx) => {
        const diaAtual = new Date();
        diaAtual.setDate(diaSemana.numero);

        const eventosDoDia = eventosAgenda.filter(evento => {
          const eventoDate = parseDbDate(evento.data);
          return (
            eventoDate.getDate() === diaSemana.numero &&
            eventoDate.getMonth() === diaAtual.getMonth() &&
            eventoDate.getFullYear() === diaAtual.getFullYear()
          );
        });

        return (
          <div
            key={idx}
            className={`day-header ${diaSemana.isHoje ? 'today-highlight' : ''}`}
          >
            <div className="day-number">{diaSemana.numero}</div>
            <div className="day-name">{diaSemana.nome}</div>
            {eventosDoDia.length > 0 && <div className="event-dot"></div>}
          </div>
        );
      })}
    </div>

    <div className="calendar-grid semana-horarios">
      {horarios.map((horaObj, i) => (
        <React.Fragment key={i}>
          <div className="hora-label">{horaObj.label}</div>
          {diasDaSemana.map((diaSemana, j) => {
            const diaAtual = new Date();
            diaAtual.setDate(diaSemana.numero);

            const eventos = eventosAgenda.filter(evento => {
              const eventoDate = parseDbDate(evento.data);
              const [horaInicio] = evento.hora_inicio.split(':').map(Number);

              return (
                eventoDate.getDate() === diaSemana.numero &&
                eventoDate.getMonth() === diaAtual.getMonth() &&
                eventoDate.getFullYear() === diaAtual.getFullYear() &&
                horaInicio === parseInt(horaObj.hora)
              );
            });

            return (
              <div
                key={j}
                className={`calendar-day semana-dia-hora ${diaSemana.isHoje ? 'today-cell' : ''}`}
              >
                {eventos.map((evento, k) => {
                  const [horaInicio, minInicio] = evento.hora_inicio.split(':').map(Number);
                  const [horaFim, minFim] = evento.hora_fim.split(':').map(Number);
                  const duracao = (horaFim - horaInicio) * 60 + (minFim - minInicio);
                  const materiaId = evento.materia_id ? String(evento.materia_id) : ''; 
                  const corSalva = materiaId ? coresMaterias[materiaId] : undefined; 

                  const { classe } = normalizarNomeMateria(evento.materia); 

                  return (
                    <div
                      key={k}
                      className={`event-tag event-aula ${classe}`}
                      style={{
                        height: `${duracao}px`,
                        backgroundColor: corSalva || undefined 
                      }}
                    >
                      <div className="event-title eSemana">{evento.materia}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  </div>
)}

        <IonRow className="linhaHorizontal"></IonRow>
        <IonRow className="rowAgenda">
          <h1 className="txtAgenda preto">Review semanal</h1>
        </IonRow>
        <IonRow className="rowsRelatorio espacoRelatorio">
            <IonRow className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande pDarkmode">{atividades.length}</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={documentText} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF pDarkmode">Total de atividades</p>
              </IonRow>
            </IonRow>

            <IonRow className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande pDarkmode">{atividades.filter(a => a.status === "concluído").length}</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={school} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF pDarkmode">Total de atividades concluídas</p>
              </IonRow>
            </IonRow>

            <IonRow className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande pDarkmode">5</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={rocket} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF pDarkmode">Total de revisões feitas</p>
              </IonRow>
            </IonRow>
          </IonRow>  
          <IonRow className="rowA rowCentro rowScroll">
            <IonCol className="colAtividades">
              <IonRow className="flexA">
                <h2 className="pDarkmode">Próximas atividades</h2>
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
                <h2 className="pDarkmode">Progresso de estudo</h2>
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
                    <h3 className="hOfensiva pDarkmode">116 dias</h3>
                    <p className="txtDescricao pOfensiva">Sequência de login</p>
                  </div>
                </IonCol>
                <IonCol className="colOfensiva2">
                  <div className="diasOfensiva">
                    <h3 className="dias1 pDarkmode">214</h3>
                    <h4 className="pDarkmode">/365</h4>
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
                          <div className="day-number dayO">{dia.numero}</div>
                          <div className="day-name dayNO">{dia.nome}</div>
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
                    <h3 className="hOfensiva pDarkmode">116 dias</h3>
                    <p className="txtDescricao pOfensiva">Sequência de login</p>
                  </div>
                </IonCol>
                <IonCol className="colOfensiva2">
                  <div className="diasOfensiva">
                    <h3 className="dias1 pDarkmode">214</h3>
                    <h4 className="pDarkmode">/365</h4>
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
                          <div className="day-number dayO">{dia.numero}</div>
                          <div className="day-name dayNO">{dia.nome}</div>
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
      </IonContent>
    </IonPage>
  );
}