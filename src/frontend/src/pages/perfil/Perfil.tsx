import React from 'react';
import { IonPage, IonContent, IonCol, IonRow, IonIcon, IonButton } from '@ionic/react';
import { personCircle } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import Header from '../../components/Header';

const Perfil: React.FC = () => {
    return (
        <IonPage>
            <Header />
                <IonContent>
                    <IonRow className="pagPerfil">
                        <IonCol className="ladoPerfil">
                            <div id="img">
                                <IonIcon icon={personCircle} id="iconePerfil"/>
                                <div id="txtOi">
                                    <p>Olá, <span>nome</span>.</p>
                                </div>
                            </div>
                            <div id="configs">
                                <h1>Configurações gerais</h1>
                                <h1>Configurações avançadas de estudo</h1>
                                <IonButton>X</IonButton>
                                <h1>Configurações de perfil</h1>
                                <IonButton>Y</IonButton>
                            </div>
                        </IonCol>
                        <IonCol className="ladoConfig">
                            <div id="infos">
                                <h1 className="preto" id="h1Titulo">Informações do perfil</h1>
                            </div>
                        </IonCol>
                    </IonRow>    
                </IonContent>
        </IonPage>
    );
};

export default Perfil;
