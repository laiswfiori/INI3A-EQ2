import React from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonButton, IonGrid, IonIcon } from '@ionic/react';
import { cellular, layers, print, checkmarkDone } from 'ionicons/icons'; 
import { useLocation } from 'react-router-dom';
import Header from '../../../components/Header';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';

interface Card {
  id?: number;
  conteudo_frente: { tipo: string; valor: string; nome?: string }[];
  conteudo_verso: { tipo: string; valor: string; nome?: string }[];
  nivelResposta?: string;
}

const Relatorio: React.FC = () => {
  const location = useLocation<{ respostas: string[]; cardsComRespostas: Card[] }>();
  const respostas = location.state?.respostas || [];
  const cardsComRespostas = location.state?.cardsComRespostas || [];

  const totalCardsFeitos = respostas.length;
  const totalAcertos = respostas.filter(r => r === 'muito fácil' || r === 'fácil').length;

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

  const gerarRelatorio = () => {
    window.print();
  };

  return (
    <IonPage className="pagina">
      <Header />
      <IonContent>
        <IonGrid id="bodyRelatorio">
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

          <IonRow className="rowsRelatorio centroRelatorio">
            <IonButton onClick={gerarRelatorio} className="btnRelatorio">
              <IonIcon icon={print} className="iconeImpressora" />
              Gerar Relatório
            </IonButton>
          </IonRow>

          <IonRow className="rowsRelatorio centroCards">
            <IonCol size="12">
              <h2 className="preto" id="txtDetalhes">Detalhes por card:</h2>
            </IonCol>
            {cardsComRespostas.map((card, index) => (
              <IonCol size="12" sizeSm="6" sizeMd="4" sizeLg="3" key={index} style={{ marginBottom: '15px' }}>
                <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Card {index + 1}</h4>
                  <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: '10px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                    {(() => {
                      const primeiroTexto = card.conteudo_frente.find(item => item.tipo === 'texto' && item.valor.trim() !== '');
                      const primeiraImagem = card.conteudo_frente.find(item => item.tipo === 'imagem' && item.valor.trim() !== '');
                      if (primeiraImagem) {
                        return <img src={primeiraImagem.valor} alt="preview" style={{ width: '80px', height: 'auto', maxHeight: '80px', objectFit: 'contain' }} />;
                      }
                      if (primeiroTexto) {
                        const displayContent = primeiroTexto.valor.length > 50 ? primeiroTexto.valor.substring(0, 47) + '...' : primeiroTexto.valor;
                        return <p style={{ fontSize: '0.8em', margin: 0, padding: 0 }}>{displayContent}</p>;
                      }
                      return <p style={{ fontSize: '0.8em', margin: 0, padding: 0 }}>[Sem Conteúdo]</p>;
                    })()}
                  </div>
                  <p style={{ fontSize: '0.9em', margin: '0', color: '#666' }}>
                    <strong>Resposta:</strong> <span style={{ color: (() => {
                      switch (card.nivelResposta) {
                        case 'muito fácil': return '#1e7e34';
                        case 'fácil': return '#28a745';
                        case 'médio': return '#ffc107';
                        case 'difícil': return '#fd7e14';
                        case 'muito difícil': return '#dc3545';
                        default: return '#000';
                      }
                    })(), fontWeight: 'bold' }}>{card.nivelResposta || 'Não Avaliado'}</span>
                  </p>
                </div>
              </IonCol>
            ))}
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Relatorio;