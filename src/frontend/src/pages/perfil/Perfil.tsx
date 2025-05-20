import React from 'react';
import { IonPage, IonContent, IonCol, IonRow, IonIcon, IonButton } from '@ionic/react';
import { caretForward, personCircle } from 'ionicons/icons';
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
                            <IonRow id="img">
                                <IonIcon icon={personCircle} id="iconePerfil"/>
                                <div id="txtOi">
                                    <p>Olá, <span>nome</span>.</p>
                                </div>
                            </IonRow>
                            <IonRow id="linhaDivisora"></IonRow>
                            <IonRow id="configs">
                                <h1>Configurações gerais</h1>
                                <IonRow className="containerConfig">
                                    <IonButton className="btnConfigg">Configurações avançadas de estudo</IonButton>
                                <IonIcon icon={caretForward} className="iconesSeta"/>
                                </IonRow>
                                <IonRow className="containerConfig">
                                    <IonButton className="btnConfigg">Configurações de perfil</IonButton> 
                                    <IonIcon icon={caretForward} className="iconesSeta"/>
                                </IonRow>
                            </IonRow>
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
