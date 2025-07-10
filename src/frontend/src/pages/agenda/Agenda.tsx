import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IonPage, IonToolbar, IonContent, IonButton, IonButtons, IonIcon, IonSelect, 
  IonSelectOption, IonSegment, IonSegmentButton, IonLabel, IonRow, IonCol, IonItem } from '@ionic/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { chevronBack, chevronForward, chevronDown, documentText, rocket, school, calendar } from 'ionicons/icons';
import Header from '../../components/Header';
import './css/geral.css'; 
import './css/ui.css'; 
import './css/layouts.css'; 

export default function () {
  const location = useLocation();
  const hoje = new Date();

  const [currentDate, setCurrentDate] = useState(hoje);
  const [selectedDate, setSelectedDate] = useState(hoje.getDate());

  const [viewMode, setViewMode] = useState<'Mês' | 'Semana'>('Mês');

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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

  const data = [
  { name: 'Feitas', value: 8 },
  { name: 'Pendentes', value: 4 }
];

  const COLORS = ['#086e10', '#d1250e'];

  return (
    <IonPage>
      <Header />
      <IonContent>
        <IonRow className="rowAgenda">
          <h1 className="txtAgenda preto">Calendário</h1>
        </IonRow>
        <IonToolbar className="laranja">
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
              
              <IonSegment
                value={viewMode}
                onIonChange={(e) => setViewMode(e.detail.value as any)}
                className="view-segment"
              >
                <IonSegmentButton value="Month">
                  <IonLabel>Mês</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="Week">
                  <IonLabel>Semana</IonLabel>
                </IonSegmentButton>
              </IonSegment>
            </div>
          </div>
        </IonToolbar>
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
                    {date.isCurrentMonth && date.day === 15 && (
                        <div className="event-tag event-prova">Prova</div>
                    )}
                    {date.isCurrentMonth && date.day === 22 && (
                        <div className="event-tag event-simulado">Simulado</div>
                    )}
                    {date.isCurrentMonth && date.day === 16 && (
                        <div className="event-tag event-vestibular">Vestibular</div>
                    )}
                    {date.isCurrentMonth && date.day === 28 && (
                        <div className="event-tag event-tarefa">Tarefa</div>
                    )}
                    {date.isCurrentMonth && date.day === 27 && (
                        <div className="event-tag event-aula">Aula</div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

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
                  <p className="txtGrande">3</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={documentText} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Total de tarefas</p>
              </IonRow>
            </IonRow>

            <IonRow className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">4</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={school} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Total de tarefas feitas</p>
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
          <IonRow className="rowA rowCentro">
            <IonCol className="colAtividades">
              <IonRow className="flexA">
                <h2>Próximas atividades</h2>
                <p className="txtDescricao">Atividades para os próximos 7 dias. Não acumule suas obrigações!</p>
              </IonRow>
              <IonRow className="flexRA">
                <IonItem className="materia-item ativAgenda">
                  <IonRow className="containerMateria">
                    <IonCol className="col1M">
                      <IonIcon icon={calendar} className="iconesTF" />
                    </IonCol>
                    <IonCol className="col2M">
                      <IonRow>
                        <IonCol className="td tdMat">
                          <h2 className="txtTMat">Simulado</h2>
                        </IonCol>
                        <IonCol id="containerConfig">
                          <IonButton className="config">...</IonButton>
                        </IonCol>
                      </IonRow>
                    </IonCol>
                    <IonRow className="rowA">
                        <p className="txtDescricao">Descrição top sobre alguma atividade top!</p>
                      </IonRow>
                    <IonRow className="rowDivsA rowA">
                      <div className="divAgenda divNivel">
                        <p>Fácil</p>
                      </div>
                      <div className="divAgenda divData">
                        <p>Para 31 de jul., 18:30</p>
                      </div>
                    </IonRow>
                  </IonRow>
                </IonItem>
              </IonRow>
            </IonCol>
            <IonCol className="colGrafico">
              <IonRow className="flexA sBorda">
                <h2>Progresso de estudo</h2>
                <p className="txtDescricao">Acompanhe seu progresso usando o flashminder.</p>
              </IonRow>
              <div
                style={{
                  width: '300px', 
                  height: '300px',  
                  margin: '0 auto', 
                }}
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
            </IonCol>
          </IonRow>  
      </IonContent>
    </IonPage>
  );
}