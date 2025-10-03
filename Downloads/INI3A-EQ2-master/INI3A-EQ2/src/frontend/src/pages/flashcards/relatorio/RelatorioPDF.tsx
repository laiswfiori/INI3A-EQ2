import React, { forwardRef } from 'react';

interface RelatorioPDFProps {
  nome: string;
  deck: string;
  total: number;
  tempoTotal: string;
  tempoPorCard: string;
  revisar: number;
  faceis: number;
  naoFaceis: number;
  timeRecords?: TimeRecord[];
}

const RelatorioPDF: React.FC<RelatorioPDFProps> = ({
  nome,
  deck,
  total,
  tempoTotal,
  tempoPorCard,
  revisar,
  faceis,
  naoFaceis,
  timeRecords
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins > 0 ? `${mins}m ` : ''}${secs}s`;
  };

  return (
    <div className="pdf-container">
      <h1>Relatório de Estudo</h1>
      <div className="pdf-section">
        <h2>Resumo Geral</h2>
        <div className="pdf-grid">
          <div className="pdf-stat">
            <span className="pdf-stat-label">Deck:</span>
            <span className="pdf-stat-value">{deck}</span>
          </div>
          <div className="pdf-stat">
            <span className="pdf-stat-label">Aluno:</span>
            <span className="pdf-stat-value">{nome}</span>
          </div>
          <div className="pdf-stat">
            <span className="pdf-stat-label">Data:</span>
            <span className="pdf-stat-value">{new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="pdf-section">
        <h2>Estatísticas</h2>
        <div className="pdf-grid">
          <div className="pdf-stat">
            <span className="pdf-stat-label">Total de Cards:</span>
            <span className="pdf-stat-value">{total}</span>
          </div>
          <div className="pdf-stat">
            <span className="pdf-stat-label">Tempo Total:</span>
            <span className="pdf-stat-value">{tempoTotal}</span>
          </div>
          <div className="pdf-stat">
            <span className="pdf-stat-label">Tempo Médio por Card:</span>
            <span className="pdf-stat-value">{tempoPorCard}</span>
          </div>
          <div className="pdf-stat">
            <span className="pdf-stat-label">Cards Fáceis:</span>
            <span className="pdf-stat-value">{faceis}</span>
          </div>
          <div className="pdf-stat">
            <span className="pdf-stat-label">Cards para Revisar:</span>
            <span className="pdf-stat-value">{revisar}</span>
          </div>
        </div>
      </div>

      {timeRecords && timeRecords.length > 0 && (
        <div className="pdf-section">
          <h2>Tempo por Card</h2>
          <div className="pdf-time-grid">
            {timeRecords.map((record, index) => (
              <div key={index} className="pdf-time-item">
                <span>Card {index + 1}:</span>
                <span>{formatTime(record.timeSpent)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

RelatorioPDF.displayName = 'RelatorioPDF';

export default RelatorioPDF;
