import React, { useRef, useState, useEffect } from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonButton, IonGrid, IonIcon, IonLabel } from '@ionic/react';
import { cellular, layers, print, checkmarkDone, download, timeOutline, speedometerOutline, chevronUp, chevronDown } from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import { getUserProfile } from '../../../lib/endpoints';
import { useReactToPrint } from 'react-to-print';
import Header from '../../../components/Header';
import RelatorioPDF from './RelatorioPDF';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';
import { PieChart, Pie, Cell, Legend } from 'recharts';
import html2canvas from "html2canvas";
import jsPDF from 'jspdf';

interface Card {
  id?: number;
  conteudo_frente: { tipo: string; valor: string; nome?: string }[];
  conteudo_verso: { tipo: string; valor: string; nome?: string }[];
  nivelResposta?: string;
}

interface TimeRecord {
  cardId?: number;
  timeSpent: number;
  timestamp: Date;
}

interface LocationState {
  nomeDeck: string;
  respostas: string[];
  cardsComRespostas: Card[];
  materias?: string[];
  revisaoGeral?: boolean;
  timeStats?: {
    totalTime: number;
    averageTime: number;
    timeRecords: TimeRecord[];
  };
}

interface ConteudoItem {
  tipo: 'texto' | 'imagem' | 'outro_tipo';
  valor: string;
}

const Relatorio: React.FC = () => {
  const location = useLocation<LocationState>();
  const {
    nomeDeck = 'Deck',
    respostas = [],
    cardsComRespostas = [],
    materias = [],
    timeStats
  } = location.state || {};

  const [showDetailedTime, setShowDetailedTime] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState<string>('Usuário');
  const pdfRef = useRef<HTMLDivElement>(null);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const ordemECores = new Map<string, string>([
    ["muito fácil", "#4CAF50"],
    ["fácil", "#8BC34A"],
    ["médio", "#FFC107"],
    ["difícil", "#FF9800"],
    ["muito difícil", "#F44336"]
  ]);

  const totalCardsFeitos = respostas.length;
  const totalAcertos = respostas.filter(r => r === 'muito fácil' || r === 'fácil').length;
  const totalNaoFaceis = respostas.filter(r => r === 'médio' || r === 'difícil' || r === 'muito difícil').length;

  const pontuacao = respostas.reduce((acc, val) => {
    switch (val) {
      case 'muito fácil': return acc + 1;
      case 'fácil': return acc + 2;
      case 'médio': return acc + 3;
      case 'difícil': return acc + 4;
      case 'muito difícil': return acc + 5;
      default: return acc;
    }
  }, 0);

  const media = totalCardsFeitos ? pontuacao / totalCardsFeitos : 0;
  const nivelFlashcard = 
    media <= 1.5 ? 'muito fácil' :
    media <= 2.5 ? 'fácil' :
    media <= 3.5 ? 'médio' :
    media <= 4.5 ? 'difícil' : 'muito difícil';

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins > 0 ? `${mins}m ` : ''}${secs}s`;
  };

  const tempoTotal = timeStats?.totalTime ? formatTime(timeStats.totalTime) : '--';
  const tempoMedio = timeStats?.averageTime ? formatTime(timeStats.averageTime) : '--';

  const distribuicaoNiveis = [
    { name: 'muito fácil', value: respostas.filter(r => r === 'muito fácil').length },
    { name: 'fácil', value: respostas.filter(r => r === 'fácil').length },
    { name: 'médio', value: respostas.filter(r => r === 'médio').length },
    { name: 'difícil', value: respostas.filter(r => r === 'difícil').length },
    { name: 'muito difícil', value: respostas.filter(r => r === 'muito difícil').length },
  ];

  const processarDados = (dados: Array<{name: string, value: number}>) => {
    return dados
      .filter(item => item.value > 0)
      .sort((a, b) => {
        const indexA = Array.from(ordemECores.keys()).indexOf(a.name);
        const indexB = Array.from(ordemECores.keys()).indexOf(b.name);
        return indexA - indexB;
      })
      .map(item => ({
        ...item,
        color: ordemECores.get(item.name) || "#CCCCCC"
      }));
  };

  const dadosOrdenados = processarDados(distribuicaoNiveis);

  useEffect(() => {
    const iframes = document.querySelectorAll('iframe[src^="blob:"]');
    iframes.forEach(iframe => {
      URL.revokeObjectURL(iframe.src);
    });
    const fetchNome = async () => {
      try {
        const user = await getUserProfile();
        setNomeUsuario(`${user.name} ${user.surname}`);
      } catch (error) {
        console.error("Erro ao buscar nome do usuário:", error);
        setNomeUsuario('Usuário');
      }
    };
    fetchNome();
  }, []);

   const contentRef = useRef<HTMLDivElement>(null);

const gerarRelatorio = async () => {
  try {
    setShowDetailedTime(true);
    
    const doc = new jsPDF('p', 'pt', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 40;
    let yPosition = margin;

    const CORES_NIVEIS: Record<string, [number, number, number]> = {
      'muito fácil': [76, 175, 80],  
      'fácil': [139, 195, 74],       
      'médio': [255, 193, 7],         
      'difícil': [255, 152, 0],       
      'muito difícil': [244, 67, 54]  
    };

    const COR_AZUL: [number, number, number] = [0, 41, 107];       
    const COR_LARANJA: [number, number, number] = [234, 115, 23]; 
    const COR_BRANCA: [number, number, number] = [255, 255, 255];
    const COR_CINZA: [number, number, number] = [240, 240, 240];


    const logoUrl = '/../../../../imgs/logoCompleta.png';
    
    const imgData = await new Promise<string>((resolve) => {
      const img = new Image();
      img.src = logoUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = () => resolve(''); 
    });

    if (imgData) {
      doc.addImage(imgData, 'PNG', margin, yPosition - 10, 60, 60);
    }

    doc.setFillColor(...COR_BRANCA);
    doc.rect(margin + 70, yPosition - 15, pageWidth - margin - 110, 60, 'F');
    doc.setDrawColor(...COR_BRANCA);
    doc.rect(margin + 70, yPosition - 15, pageWidth - margin - 110, 60);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('RELATÓRIO DE ESTUDO', margin + 80, yPosition + 15);
    
    yPosition += 70;

    doc.setFillColor(...COR_LARANJA);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 80, 'F');
    doc.setDrawColor(...COR_LARANJA);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 80);
    
    doc.setFontSize(12);
    doc.setTextColor(...COR_BRANCA);
    doc.text(`Aluno: ${nomeUsuario}`, margin + 15, yPosition + 25);
    doc.text(`Deck: ${nomeDeck}`, margin + 15, yPosition + 45);
    
    if (materias?.length) {
      doc.text(`Matéria: ${materias.join(', ')}`, margin + 15, yPosition + 65);
      yPosition += 90;
    } else {
      yPosition += 70;
    }

    doc.setFillColor(...COR_AZUL);
    doc.rect(margin, yPosition - 10, pageWidth - 2 * margin, 35, 'F');
    doc.setDrawColor(...COR_AZUL);
    doc.rect(margin, yPosition - 10, pageWidth - 2 * margin, 35);
    doc.setFontSize(16);
    doc.setTextColor(...COR_BRANCA);
    doc.text('DESTAQUES', margin + 15, yPosition + 15);
    yPosition += 35;

    const highlights = [
      { title: 'TOTAL DE CARDS', value: totalCardsFeitos, color: COR_BRANCA },
      { title: 'CARDS FÁCEIS', value: totalAcertos, color: COR_BRANCA },
      { title: 'NÍVEL GERAL', value: nivelFlashcard, color: COR_BRANCA }
    ];

    const cardWidth = (pageWidth - 2 * margin - 20) / 3;
    
    highlights.forEach((hl, index) => {
      const x = margin + index * (cardWidth + 10);
      
      doc.setFillColor(...hl.color);
      doc.rect(x, yPosition, cardWidth, 90, 'F');
      doc.setDrawColor(150, 150, 150);
      doc.rect(x, yPosition, cardWidth, 90);
      
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.text(hl.title, x + 10, yPosition + 25);
      
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      
      if (index === 2) { 
        const nivelCor = CORES_NIVEIS[nivelFlashcard] || COR_AZUL;
        doc.setTextColor(...nivelCor);
      } else {
        doc.setTextColor(0, 0, 0);
      }
      
      doc.text(hl.value.toString(), x + 10, yPosition + 60);
    });
    yPosition += 110;

    doc.setFillColor(...COR_AZUL);
    doc.rect(margin, yPosition - 10, pageWidth - 2 * margin, 35, 'F');
    doc.setDrawColor(...COR_AZUL);
    doc.rect(margin, yPosition - 10, pageWidth - 2 * margin, 35);
    doc.setFontSize(16);
    doc.setTextColor(...COR_BRANCA);
    doc.text('TEMPO DE ESTUDO', margin + 15, yPosition + 15);
    yPosition += 35;

    doc.setFillColor(...COR_CINZA);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 80, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, yPosition, pageWidth - 2 * margin, 80);
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total: ${tempoTotal}`, margin + 15, yPosition + 30);
    doc.text(`Médio: ${tempoMedio}`, margin + 200, yPosition + 30);
    yPosition += 100;

    if (timeStats?.timeRecords && timeStats.timeRecords.length > 0) {
      doc.setFillColor(...COR_AZUL);
      doc.rect(margin, yPosition - 10, pageWidth - 2 * margin, 35, 'F');
      doc.setDrawColor(...COR_AZUL);
      doc.rect(margin, yPosition - 10, pageWidth - 2 * margin, 35);
      doc.setFontSize(16);
      doc.setTextColor(...COR_BRANCA);
      doc.text('TEMPO POR CARD', margin + 15, yPosition + 15);
      yPosition += 35;

      const tableWidth = pageWidth - 2 * margin;
      const rowHeight = 22;
      const col1Width = 60;
      const col2Width = 100;
      const col3Width = tableWidth - col1Width - col2Width;

      doc.setFillColor(...COR_LARANJA);
      doc.rect(margin, yPosition, tableWidth, rowHeight, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COR_BRANCA);
      doc.text('Card', margin + 10, yPosition + 16);
      doc.text('Tempo', margin + col1Width + 10, yPosition + 16);
      doc.text('Dificuldade', margin + col1Width + col2Width + 10, yPosition + 16);
      yPosition += rowHeight;

      doc.setFont('helvetica', 'normal');
      timeStats.timeRecords.forEach((record, index) => {
        if (yPosition + rowHeight > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          yPosition = margin;
          doc.setFillColor(...COR_BRANCA);
          doc.rect(margin, yPosition, tableWidth, rowHeight, 'F');
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...COR_BRANCA);
          doc.text('Card', margin + 10, yPosition + 16);
          doc.text('Tempo', margin + col1Width + 10, yPosition + 16);
          doc.text('Dificuldade', margin + col1Width + col2Width + 10, yPosition + 16);
          yPosition += rowHeight;
          doc.setFont('helvetica', 'normal');
        }

        const card = cardsComRespostas[index];
        const nivel = card?.nivelResposta || '';
        const corNivel = CORES_NIVEIS[nivel] || COR_CINZA;
        
        doc.setFillColor(corNivel[0], corNivel[1], corNivel[2], 20);
        doc.rect(margin, yPosition, tableWidth, rowHeight, 'F');
        doc.setDrawColor(255, 255, 255);
        doc.rect(margin, yPosition, tableWidth, rowHeight);
        
        doc.setTextColor(0, 0, 0);
        doc.text(`#${index + 1}`, margin + 10, yPosition + 16);
        doc.text(formatTime(record.timeSpent), margin + col1Width + 10, yPosition + 16);
        
        doc.setTextColor(corNivel[0], corNivel[1], corNivel[2]);
        doc.text(nivel, margin + col1Width + col2Width + 10, yPosition + 16);
        
        yPosition += rowHeight;
      });

      yPosition += 20;
    }

    doc.addPage();
    yPosition = margin;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.setTextColor(...COR_AZUL);
    doc.text('DISTRIBUIÇÃO DAS RESPOSTAS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 30;

    const graficoElement = document.querySelector('.recharts-wrapper');
    if (graficoElement) {
      const canvas = await html2canvas(graficoElement as HTMLElement, {
        scale: 1.5, 
        backgroundColor: '#ffffff',
        logging: true
      });
      
      const imgWidth = (pageWidth - 2 * margin) * 0.6;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const centerX = (pageWidth - imgWidth) / 2;
      
      doc.addImage(
        canvas, 
        'PNG', 
        centerX, 
        yPosition, 
        imgWidth, 
        imgHeight
      );
      
      yPosition += imgHeight + 40; 
    }

    doc.addPage();
    yPosition = margin;

    const dificuldades = [
      { titulo: 'CARDS FÁCEIS', cor: [34, 139, 34], selector: '.bloco-facil' },      
      { titulo: 'CARDS MÉDIOS', cor: [255, 193, 7], selector: '.bloco-medio' },       
      { titulo: 'CARDS DIFÍCEIS', cor: [220, 53, 69], selector: '.bloco-dificil' }     
    ];

    for (const dificuldade of dificuldades) {
      const section = document.querySelector(dificuldade.selector);
      if (section) {
        const canvas = await html2canvas(section as HTMLElement, {
          scale: 1.5,
          backgroundColor: '#ffffff'
        });
        const sectionHeight = (canvas.height * (pageWidth - 80)) / canvas.width;

        if (yPosition + sectionHeight + 60 > doc.internal.pageSize.getHeight()) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFillColor(...dificuldade.cor);
        doc.rect(margin, yPosition, pageWidth - 2 * margin, 30, 'F');
        doc.setFontSize(14);
        doc.setTextColor(...COR_BRANCA);
        doc.text(dificuldade.titulo, margin + 15, yPosition + 20);
        yPosition += 40;

        doc.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          margin,
          yPosition,
          pageWidth - 80,
          sectionHeight
        );
        yPosition += sectionHeight + 30;
      }
    }

    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(
        `Página ${i} de ${totalPages}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 20,
        { align: 'center' }
      );
    }
    const pdfOutput = doc.output('bloburl');
    

    const newWindow = window.open(pdfOutput, '_blank');
    
    if (!newWindow) {
      const link = document.createElement('a');
      link.href = pdfOutput;
      link.download = `Relatorio_${nomeDeck.replace(/\s+/g, '_')}.pdf`;
      link.click();
    }

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    alert('Ocorreu um erro ao gerar o PDF.');
  } finally {
    setShowDetailedTime(false);
  }
};

  const ORDEM_LEGENDA = [
    "muito fácil",
    "fácil", 
    "médio",
    "difícil",
    "muito difícil"
  ] as const;

  const CORES_LEGENDA = {
    "muito fácil": "#4CAF50",
    "fácil": "#8BC34A",
    "médio": "#FFC107",
    "difícil": "#FF9800",
    "muito difícil": "#F44336"
  };

  const LegendaOrdenada = ({ payload }: { payload: any[] }) => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: '20px',
      padding: '20px 0'
    }}>
      {ORDEM_LEGENDA
        .filter(nome => payload.some((item: any) => item.value.toLowerCase() === nome))
        .map(nome => {
          const item = payload.find((i: any) => i.value.toLowerCase() === nome);
          return (
            <div key={nome} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '14px',
                height: '14px',
                backgroundColor: CORES_LEGENDA[nome],
                marginRight: '8px',
                borderRadius: '2px'
              }} />
              <span style={{ fontSize: '14px' }}>
                {nome.charAt(0).toUpperCase() + nome.slice(1)}
              </span>
            </div>
          );
        })}
    </div>
  );

  const renderCardContent = (card: any) => {
    const primeiroTexto = card.conteudo_frente.find((item: ConteudoItem) => 
      item.tipo === 'texto' && item.valor.trim() !== ''
    );

    const primeiraImagem = card.conteudo_frente.find((item: ConteudoItem) => 
      item.tipo === 'imagem' && item.valor.trim() !== ''
    );
    
    if (primeiraImagem) {
      return <img src={primeiraImagem.valor} alt="preview" className="card-imagem" />;
    }
    if (primeiroTexto) {
      const displayContent = primeiroTexto.valor.length > 50 ? 
        primeiroTexto.valor.substring(0, 47) + '...' : 
        primeiroTexto.valor;
      return <p className="card-texto">{displayContent}</p>;
    }
    return <p className="card-sem-conteudo">[Sem conteúdo para exibir]</p>;
  };

  const getBadgeClass = (nivel: any) => {
    switch(nivel) {
      case 'muito fácil': return 'badge-facil';
      case 'fácil': return 'badge-facil';
      case 'médio': return 'badge-medio';
      case 'difícil': return 'badge-dificil';
      case 'muito difícil': return 'badge-dificil';
      default: return '';
    }
  };

  const cardsFaceis = cardsComRespostas.filter(card => 
    card.nivelResposta === 'muito fácil' || card.nivelResposta === 'fácil'
  );

  const cardsMedios = cardsComRespostas.filter(card => 
    card.nivelResposta === 'médio'
  );

  const cardsDificeis = cardsComRespostas.filter(card => 
    card.nivelResposta === 'difícil' || card.nivelResposta === 'muito difícil'
  );

  const PreviewModal = ({ pdfUrl, onClose, onDownload }: {
  pdfUrl: string;
  onClose: () => void;
  onDownload: () => void;
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Pré-visualização do Relatório</h3>
          <button onClick={onClose} className="close-button">
            &times;
          </button>
        </div>
        
        <div className="pdf-preview-container">
          <iframe 
            src={pdfUrl} 
            width="100%" 
            height="500px"
            style={{ border: 'none' }}
            title="Pré-visualização do Relatório"
          />
        </div>
        
        <div className="modal-footer">
          <button onClick={onDownload} className="download-button">
            <IonIcon icon={download} /> Baixar Relatório
          </button>
          <button onClick={onClose} className="cancel-button">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

  return (
    <IonPage className="pagina">
      <Header />
      <IonContent>
        <IonGrid id="bodyRelatorio" className="no-print" ref={pdfRef}>
          <IonRow className="rowsRelatorio centroRelatorio">
            <h1 className="preto">Parabéns, você concluiu esse deck!</h1>
            <p id="pCentro">Você finalizou todos os flashcards desta etapa com sucesso.</p>
          </IonRow>

          <IonRow className="rowsRelatorio espacoRelatorio">
            <IonRow className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">{totalCardsFeitos}</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={layers} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Total de cards realizados</p>
              </IonRow>
            </IonRow>

            <IonRow className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">{totalAcertos}</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={checkmarkDone} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow>
                <p className="txtTF">Total de cards fáceis ou muito fáceis</p>
              </IonRow>
            </IonRow>

            <IonRow className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">{nivelFlashcard}</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={cellular} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow className="colDesempenho">
                <p className="txtTF">Desempenho</p>
                <p className="txtTF">Nível: <span>{nivelFlashcard}</span></p>
              </IonRow>
            </IonRow>
          </IonRow>
          <IonRow className="rowsRelatorio ion-justify-content-center">
            <IonCol size="12" sizeMd="8" sizeLg="6">
              <div className="tempo-stats-container">
                <div 
                  className="tempo-stats-header" 
                  onClick={() => setShowDetailedTime(!showDetailedTime)}
                >
                  <h2 className="tempo-title">
                    Estatísticas de Tempo
                    <IonIcon 
                      icon={showDetailedTime ? chevronUp : chevronDown} 
                      className="tempo-toggle-icon"
                    />
                  </h2>
                  <div className="tempo-summary">
                    <div className="tempo-summary-item">
                      <div className="tempo-icon-container">
                        <IonIcon icon={timeOutline} className="tempo-icon" />
                      </div>
                      <div>
                        <p className="tempo-label">Tempo Total</p>
                        <p className="tempo-value">{tempoTotal}</p>
                      </div>
                    </div>
                    <div className="tempo-summary-item">
                      <div className="tempo-icon-container">
                        <IonIcon icon={speedometerOutline} className="tempo-icon" />
                      </div>
                      <div>
                        <p className="tempo-label">Tempo Médio</p>
                        <p className="tempo-value">{tempoMedio}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {showDetailedTime && timeStats?.timeRecords && (
                  <div className="tempo-details">
                    <h3 className="tempo-subtitle">Tempo por Card</h3>
                    <div className="tempo-cards-container">
                      {timeStats.timeRecords.map((record, index) => (
                        <div key={index} className="tempo-card-item">
                          <span className="tempo-card-numero">Card {index + 1}</span>
                          <span className="tempo-card-tempo">{formatTime(record.timeSpent)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </IonCol>
          </IonRow>

          <IonRow className="rowsRelatorio grafico">
            <IonCol size="12" className="ion-text-center">
              <div className="grafico-wrapper">
                <h2 className="titulo-grafico">Distribuição das respostas</h2>
                <div className="chart-container">
                  <PieChart width={350} height={350}>
                    <Pie
                      data={dadosOrdenados}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      innerRadius={60}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      isAnimationActive={false} 
                    >
                      {dadosOrdenados.map((item) => (
                        <Cell 
                          key={`cell-${item.name}`} 
                          fill={item.color}
                        />
                      ))}
                    </Pie>
                    <Legend content={<LegendaOrdenada />} />
                  </PieChart>
                </div>
              </div>
            </IonCol>
          </IonRow>

          <div className="relatorio-container">
            <IonRow>
              <IonCol size="12">
                <h2 className="titulo-grafico">Detalhes por card</h2>
              </IonCol>

              {/* Bloco Fácil */}
              <IonCol size="12">
                <div className="bloco-dificuldade bloco-facil">
                  <div className="cabecalho-bloco">
                    <div className="icone-dificuldade icone-facil">✓</div>
                    <h3 className="titulo-bloco titulo-facil">Fáceis</h3>
                  </div>
                  
                  <IonRow>
                    {cardsFaceis.map((card, index) => (
                      <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={`facil-${index}`}>
                        <div className={`card-container card-facil`}>
                          <div className="card-header">
                            <h4 className="card-titulo">Card {cardsComRespostas.indexOf(card) + 1}</h4>
                            <span className={`badge-dificuldade ${getBadgeClass(card.nivelResposta)}`}>
                              {card.nivelResposta}
                            </span>
                          </div>
                          
                          <div className="card-content">
                            {renderCardContent(card)}
                          </div>
                        </div>
                      </IonCol>
                    ))}
                  </IonRow>
                </div>
              </IonCol>

              {/* Bloco Médio */}
              <IonCol size="12">
                <div className="bloco-dificuldade bloco-medio">
                  <div className="cabecalho-bloco">
                    <div className="icone-dificuldade icone-medio">~</div>
                    <h3 className="titulo-bloco titulo-medio">Médios</h3>
                  </div>
                  
                  <IonRow>
                    {cardsMedios.map((card, index) => (
                      <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={`medio-${index}`}>
                        <div className={`card-container card-medio`}>
                          <div className="card-header">
                            <h4 className="card-titulo">Card {cardsComRespostas.indexOf(card) + 1}</h4>
                            <span className={`badge-dificuldade ${getBadgeClass(card.nivelResposta)}`}>
                              {card.nivelResposta}
                            </span>
                          </div>
                          
                          <div className="card-content">
                            {renderCardContent(card)}
                          </div>
                        </div>
                      </IonCol>
                    ))}
                  </IonRow>
                </div>
              </IonCol>

              {/* Bloco Difícil */}
              <IonCol size="12">
                <div className="bloco-dificuldade bloco-dificil">
                  <div className="cabecalho-bloco">
                    <div className="icone-dificuldade icone-dificil">!</div>
                    <h3 className="titulo-bloco titulo-dificil">Difíceis</h3>
                  </div>
                  
                  <IonRow>
                    {cardsDificeis.map((card, index) => (
                      <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={`dificil-${index}`}>
                        <div className={`card-container card-dificil`}>
                          <div className="card-header">
                            <h4 className="card-titulo">Card {cardsComRespostas.indexOf(card) + 1}</h4>
                            <span className={`badge-dificuldade ${getBadgeClass(card.nivelResposta)}`}>
                              {card.nivelResposta}
                            </span>
                          </div>
                          
                          <div className="card-content">
                            {renderCardContent(card)}
                          </div>
                        </div>
                      </IonCol>
                    ))}
                  </IonRow>
                </div>
              </IonCol>
            </IonRow>
          </div>
          <IonRow className="rowsRelatorio centrobtns">
            <IonButton onClick={gerarRelatorio} className="btnRelatorio">
              <IonIcon icon={print} className="iconeImpressora" />
              Gerar relatório
            </IonButton>

            {showPreviewModal && pdfPreviewUrl && (
              <PreviewModal
                pdfUrl={pdfPreviewUrl}
                onClose={() => {
                  setShowPreviewModal(false);
                  URL.revokeObjectURL(pdfPreviewUrl);
                }}
                onDownload={() => {
                  const link = document.createElement('a');
                  link.href = pdfPreviewUrl;
                  link.download = `Relatorio_${nomeDeck.replace(/\s+/g, '_')}.pdf`;
                  link.click();
                  setShowPreviewModal(false);
                  URL.revokeObjectURL(pdfPreviewUrl);
                }}
              />
            )}
            <IonButton onClick={() => window.print()} className="btnRelatorio">
              <IonIcon icon={download} className="iconeImpressora" />
              Salvar estatísticas
            </IonButton>
          </IonRow>

        </IonGrid>

        <div style={{ position: 'fixed', left: '-10000px', top: 'auto' }}>
          <div ref={pdfRef}>
            <RelatorioPDF
              nome={nomeUsuario}
              deck={nomeDeck}
              total={totalCardsFeitos}
              tempoTotal={tempoTotal}
              tempoPorCard={tempoMedio}
              revisar={totalNaoFaceis}
              faceis={totalAcertos}
              naoFaceis={totalNaoFaceis}
              timeRecords={timeStats?.timeRecords}
            />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Relatorio;