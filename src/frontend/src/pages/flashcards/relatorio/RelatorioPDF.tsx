import React, { forwardRef } from 'react';

interface PDFProps {
  nome: string;
  deck: string;
  total: number;
  tempoTotal: string;
  tempoPorCard: string;
  revisar: number;
  faceis: number;
  naoFaceis: number;
}

const RelatorioPDF = forwardRef<HTMLDivElement, PDFProps>((props, ref) => (
  <div ref={ref} className="pdf-container">
    <h1>{props.nome}</h1>
    <h2>{props.deck}</h2>
    <div className="pdf-section">
      <div className="pdf-stats">
        <div>
          <p><strong>Total de cards:</strong> {props.total}</p>
          <p><strong>Tempo total:</strong> {props.tempoTotal}</p>
          <p><strong>Tempo por card:</strong> {props.tempoPorCard}</p>
        </div>
        <div className="pdf-graph">
          <div className="graph-placeholder">[Gráfico]</div>
          <small>Distribuição de dificuldade</small>
        </div>
      </div>
    </div>
    <div className="pdf-results">
      <div className="result-card easy">
        <h3>Cards fáceis</h3>
        <div className="result-value">
          {props.faceis} ({Math.round((props.faceis / props.total) * 100)}%)
        </div>
      </div>
      <div className="result-card hard">
        <h3>Cards difíceis</h3>
        <div className="result-value">
          {props.naoFaceis} ({Math.round((props.naoFaceis / props.total) * 100)}%)
        </div>
      </div>
    </div>
  </div>
));

RelatorioPDF.displayName = 'RelatorioPDF';

export default RelatorioPDF;
