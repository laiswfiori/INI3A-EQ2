import React, { useEffect, useState } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import './css/geral.css';
import Header from '../../../components/Header';

const Conteudos: React.FC = () => {

    useEffect(() => {
        fetch("http://localhost:3333/topicos")
            .then(r => r.json())
            .then(resp => {
                setTopicos(resp);
            })
    },[]);

    const [topicos, setTopicos] = useState([]);

    return (
    <IonPage className="pagina">
        <Header />
        
        <IonContent className="body">
          <h1 className="titulo">Conteudos</h1>
            {topicos}
        </IonContent>
        
      </IonPage>
    );
  };
  
  export default Conteudos;