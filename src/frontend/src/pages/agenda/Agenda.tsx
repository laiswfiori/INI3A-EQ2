import { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
  IonLabel,
} from '@ionic/react';
import { chevronBack, chevronForward, chevronDown } from 'ionicons/icons';
import './css/Agenda.css'; 

export default function () {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1)); 
  const [selectedDate, setSelectedDate] = useState(8);
  const [viewMode, setViewMode] = useState<'Mês' | 'Semana'>('Mês');

  // A lógica para manipulação de datas permanece a mesma.
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

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.getDate());
  };

  const days = getDaysInMonth(currentDate);
  const currentMonthYear = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="dark">
          <IonTitle>Calendário</IonTitle>
        </IonToolbar>
        <IonToolbar color="dark">
          <div className="calendar-controls ion-padding-horizontal">
            {/* Controles de Navegação e Mês/Ano */}
            <div className="month-navigation">
              <IonButtons>
                <IonButton onClick={() => navigateMonth('prev')} fill="clear" color="light">
                  <IonIcon slot="icon-only" icon={chevronBack} />
                </IonButton>
                <IonButton onClick={() => navigateMonth('next')} fill="clear" color="light">
                  <IonIcon slot="icon-only" icon={chevronForward} />
                </IonButton>
              </IonButtons>
              <IonButton onClick={goToToday} fill="clear" color="light" size="small">
                Hoje
              </IonButton>
              <span className="month-year-label">{currentMonthYear}</span>
            </div>

            {/* Filtros e Seletor de Visualização */}
            <div className="view-controls">
              <IonSelect
                className="category-select"
                interface="popover"
                placeholder="Categorias"
                value="all"
              >
                <IonSelectOption value="all">Todas as Categorias</IonSelectOption>
                <IonSelectOption value="work">Trabalho</IonSelectOption>
                <IonSelectOption value="personal">Pessoal</IonSelectOption>
                <IonSelectOption value="deadlines">Prazos</IonSelectOption>
                <IonSelectOption value="meetings">Reuniões</IonSelectOption>
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
      </IonHeader>

      <IonContent fullscreen className="ion-padding">
        <div className="calendar-grid-container">
          {/* Cabeçalho com os dias da semana */}
          <div className="calendar-grid days-of-week-header">
            {daysOfWeek.map((day) => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
          </div>

          {/* Grade com os dias do mês */}
          <div className="calendar-grid">
            {days.map((date, index) => (
              <div
                key={index}
                className={`calendar-day ${!date.isCurrentMonth ? 'other-month' : ''} ${
                  date.day === selectedDate && date.isCurrentMonth ? 'selected-day' : ''
                }`}
                onClick={() => date.isCurrentMonth && setSelectedDate(date.day)}
              >
                <span className="day-number">{date.day}</span>
                <div className="events-container">
                    {/* Eventos de exemplo */}
                    {date.isCurrentMonth && date.day === 15 && (
                        <div className="event-tag event-meeting">Reunião</div>
                    )}
                    {date.isCurrentMonth && date.day === 22 && (
                        <div className="event-tag event-deadline">Prazo</div>
                    )}
                    {date.isCurrentMonth && date.day === 8 && (
                        <div className="event-tag event-review">Revisão</div>
                    )}
                    {date.isCurrentMonth && date.day === 28 && (
                        <div className="event-tag event-call">Chamada</div>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legenda */}
        <div className="legend-container">
            <div className="legend-item"><div className="legend-color event-meeting"></div> Reuniões</div>
            <div className="legend-item"><div className="legend-color event-deadline"></div> Prazos</div>
            <div className="legend-item"><div className="legend-color event-review"></div> Revisões</div>
            <div className="legend-item"><div className="legend-color event-call"></div> Chamadas</div>
        </div>
      </IonContent>
    </IonPage>
  );
}