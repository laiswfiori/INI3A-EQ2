import React from 'react';
import { IonPage, IonContent, IonImg, IonIcon, IonLabel } from '@ionic/react';
import { earth, leaf, book, calculator } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import Header from '../../components/Header';

const Home: React.FC = () => {
  return (
  <IonPage className="pagina">
      <Header />
      
      <IonContent>
        <div id="body">

          <section id="s1">
            <div id="divTxtHome">
              <div className="titulo1"><h1 className="titulo">Pronto para começar seus estudos?</h1></div>
              <div className="titulo2"><h2 className="subtitulo">Turbine seus estudos ao criar um cronograma de estudos adaptado a sua rotina.</h2></div>
            </div>

            <div id="divComputador">
              <IonImg src="/imgs/computador.png" id="computador" alt="Computador com calendário"/>
            </div>
          </section>

          <section id="s2">
            <div id="divCelular">
            {/*<IonImg src="/imgs/computador.png" id="computador" alt="Celular com flashcard"/> Colocar ft de celular + flashcard */}
            </div>

            <div id="divFraquezas">
              <div className="titulo1"><h1 className="titulo">Aprender a identificar suas fraquezas.</h1></div>
              <div className="titulo2"><h2 className="subtitulo">Revisando todo dia, você assimila seus erros e consolida seus acertos.</h2></div>
            </div> 
          </section>

          <section id="s3">
            <div id="divAlcance">
              <div className="titulo3"><h1 className="titulo">Tenha tudo ao seu alcance.</h1></div>
              <div className="titulo4"><h2 className="subtitulo">Você pode acessar qualquer documento, quando quiser.</h2></div>
            </div>

            <div id="divCelConteudos">
            {/*<IonImg src="/imgs/computador.png" id="computador" alt="Computador com conteudos"/> Colocar ft de web + conteudos */}
            </div>
          </section>

          <section id="s4">
            <div id="divMateria">
              <div className="titulo3"><h1 className="titulo">Aprenda qualquer matéria.</h1></div>
              <div className="titulo4"><h2 className="subtitulo">Você está no comando! Adicone conteúdo de biologia à programação.</h2></div>
            </div>

            <div id="divMaterias">
              <div id="m1" className="materia">
                <IonIcon icon={earth} className="iconesM"/>
                <IonLabel className="iconesTxtM">Geografia</IonLabel>
              </div>
              <div id="m2" className="materia">
                <IonIcon icon={leaf} className="iconesM"/>
                <IonLabel className="iconesTxtM">Biologia</IonLabel>
              </div>
              <div id="m3" className="materia">
                <IonIcon icon={book} className="iconesM"/>
                <IonLabel className="iconesTxtM">História</IonLabel>
              </div>
              <div id="m4" className="materia">
               <IonIcon icon={calculator} className="iconesM"/>
               <IonLabel className="iconesTxtM">Matemática</IonLabel>
              </div>
            </div>
          </section>

        </div>
      </IonContent>
      
    </IonPage>
  );
};

export default Home;
