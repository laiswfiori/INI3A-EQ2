import React from 'react';
import { IonPage, IonContent, IonRow, IonCol, IonButton, IonGrid, IonIcon } from '@ionic/react';
import { cellular, checkmarkDone, layers, print } from 'ionicons/icons'; 
import Header from '../../../components/Header';
import './css/geral.css';
import './css/ui.css';
import './css/layouts.css';

const Relatorio: React.FC = () => {
  const totalCardsFeitos = 120;
  const totalAcertos = 95;
  const desempenho = 'Bom';
  const nível = 'fácil';

  const gerarRelatorio = () => {
    alert('Relatório gerado! (função ainda não implementada)');
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
                            <p className="txtGrande">{desempenho}</p> 
                        </IonCol>
                        <IonCol className="altD iconFim">
                            <IonIcon icon={cellular} className="iconesTF" />
                        </IonCol>
                    </IonRow>
                    <IonRow className="colDesempenho">
                        <p className="txtTF">Desempenho</p>
                        <p className="txtTF">Nível: <span>{nível}</span></p>
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
