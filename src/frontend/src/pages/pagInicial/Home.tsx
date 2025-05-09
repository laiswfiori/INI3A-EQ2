import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonImg, IonIcon, IonLabel, IonButton } from '@ionic/react';
import { library, brush, book, school, accessibility, earth, leaf, batteryCharging, planet, calculator } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import Header from '../../components/Header';
import AnimacaoSVG from '../../components/AnimacaoSVG';

const Home: React.FC = () => {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const materias = [
    { id: 'm1', icon: library, label: 'Português' },
    { id: 'm2', icon: brush, label: 'Artes' },
    { id: 'm3', icon: book, label: 'História' },
    { id: 'm4', icon: school, label: 'Filosofia' },
    { id: 'm5', icon: accessibility, label: 'Sociologia' },
    { id: 'm6', icon: earth, label: 'Geografia' },
    { id: 'm7', icon: leaf, label: 'Biologia' },
    { id: 'm8', icon: batteryCharging, label: 'Química' },
    { id: 'm9', icon: planet, label: 'Física' },
    { id: 'm10', icon: calculator, label: 'Matemática' },
  ];

  const handleNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += 200;
    }
  };

  const handlePrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= 200;
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
        if (carouselRef.current) {
            const itemWidth = 170; 
            const maxScrollLeft = carouselRef.current.scrollWidth - carouselRef.current.clientWidth;
            
            if (carouselRef.current.scrollLeft >= maxScrollLeft - 10) {
                carouselRef.current.scrollLeft = 0;
            } else {
                carouselRef.current.scrollLeft += itemWidth;
            }
        }
    }, 3000);

    return () => clearInterval(interval);
}, []);

  const history = useHistory();
  const navPerfil = () => {
    history.push('/registro/registro');
  }

  return (
  <IonPage className="pagina">
      <Header />
      
      <IonContent>
        <div id="bodyHome">

          <section id="s1">
            <div id="divTxtHome">
              <div className="titulo1"><h1 className="titulo">Pronto para começar seus estudos?</h1></div>
              <div className="titulo2"><h2 className="subtitulo">Turbine seus estudos ao criar um cronograma de estudos adaptado a sua rotina.</h2></div>
              <div id="btnContainer">
                <IonButton id="btnLogin" onClick={navPerfil}>Login</IonButton>
              </div>
            </div>

            <div id="divCartas">
              <IonImg src="/imgs/card1.png" id="card1" className="carta" alt="Card 1"/>
              <IonImg src="/imgs/card2.png" id="card2" className="carta" alt="Card 2"/>
            </div>
          </section>

          <section id="s2">  
            <div id="divFraquezas">
              <div className="titulo1"><h1 className="titulo">Aprender a identificar suas fraquezas.</h1></div>
              <div className="titulo2"><h2 className="subtitulo">Revisando todo dia, você assimila seus erros e consolida seus acertos.</h2></div>
            </div> 

            <div id="divCaneta">
              <AnimacaoSVG />
            </div>
          </section>

          <section id="s3">
            <div id="divAlcance">
              <div className="titulo3"><h1 className="titulo">Tenha tudo ao seu alcance.</h1></div>
              <div className="titulo4"><h2 className="subtitulo">Você pode acessar qualquer documento, quando quiser.</h2></div>
            </div>

            <div id="divCelConteudos">
              <IonImg src="/imgs/celular.png" id="celular" alt="Celular com conteudos"/>
            </div>
          </section>

          <section id="s4">
            <div id="divMateria">
              <div className="titulo3"><h1 className="titulo">Aprenda qualquer matéria.</h1></div>
              <div className="titulo4"><h2 className="subtitulo">Você está no comando! Adicone conteúdo de geografia à física.</h2></div>
            </div>

            <div className="divCarousel">
              <button onClick={handlePrev} className="carouselButton prevButton"> &lt; </button>

              <div id="divMaterias" className="materiasCarousel" ref={carouselRef}>
                {materias.map((materia) => (
                  <div key={materia.id} className="materia" id={materia.id}>
                    <IonIcon icon={materia.icon} className="iconesM" />
                    <IonLabel className="iconesTxtM">{materia.label}</IonLabel>
                  </div>
                ))}
              </div>

              <button onClick={handleNext} className="carouselButton nextButton"> &gt; </button>
            </div>
          </section>
        </div>
      </IonContent>
      
    </IonPage>
  );
};

export default Home;
