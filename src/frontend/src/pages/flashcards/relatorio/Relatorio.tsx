import React from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonButton, IonGrid, IonIcon } from '@ionic/react';
import { cellular, checkmarkDone, layers, print } from 'ionicons/icons'; 
import { useLocation } from 'react-router-dom';
import Header from '../../../components/Header';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';

const Relatorio: React.FC = () => {
  const location = useLocation<{ respostas: string[] }>();
  const respostas = location.state?.respostas || [];

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

  const nivel =
    media <= 1.5 ? 'muito fácil' :
    media <= 2.5 ? 'fácil' :
    media <= 3.5 ? 'médio' :
    media <= 4.5 ? 'difícil' : 'muito difícil';

  const gerarRelatorio = () => {
    alert('Relatório gerado! (NÃO TÁ GERANDO!!!!! NÃO FOI FEITO!!! ALGM FAÇA!!!)');
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
                <p className="txtTF">Total de flashcards realizados</p>
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
                <p className="txtTF">Total de acertos</p>
              </IonRow>
            </IonRow>

            <IonRow className="estDivs">
              <IonRow className="espDiv">
                <IonCol className="altD">
                  <p className="txtGrande">{nivel}</p>
                </IonCol>
                <IonCol className="altD iconFim">
                  <IonIcon icon={cellular} className="iconesTF" />
                </IonCol>
              </IonRow>
              <IonRow className="colDesempenho">
                <p className="txtTF">Desempenho</p>
                <p className="txtTF">Nível: <span>{nivel}</span></p>
              </IonRow>
            </IonRow>
          </IonRow>

          <IonRow className="rowsRelatorio centroRelatorio">
            <IonButton onClick={gerarRelatorio} className="btnRelatorio">
              <IonIcon icon={print} className="iconeImpressora" />
              Gerar Relatório
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Relatorio;
