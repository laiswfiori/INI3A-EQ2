import React, { useEffect, useRef } from 'react';
import { IonPage, IonContent, IonImg, IonIcon, IonLabel, IonButton } from '@ionic/react';
import { library, brush, book, school, accessibility, earth, leaf, flask, planet, calculator } from 'ionicons/icons';
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
    { id: 'm8', icon: flask, label: 'Química' },
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
            const itemWidth = carouselRef.current?.querySelector('.materia')?.clientWidth || 170;
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


  return (
  <IonPage className="pagina">
      <Header />
      
      <IonContent>
        <div id="bodyHome">

          <section id="s1">
            <div id="divTxtHome">
              <div className="titulo1"><h1 className="titulo">Pronto para começar seus estudos?</h1></div>
              <div className="titulo2"><h2 className="subtitulo">Turbine seus estudos ao criar um cronograma de estudos adaptado a sua rotina.</h2></div>
              <div className="lupa">
                <div className="lupaMiniContainer">
                  <div className="barContainer">
                    <span className="bar"></span>
                    <span className="bar bar2"></span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 101 114"
                    className="svgIcon"
                  >
                    <circle
                      stroke-width="7"
                      stroke="black"
                      transform="rotate(36.0692 46.1726 46.1727)"
                      r="29.5497"
                      cy="46.1727"
                      cx="46.1726"
                    ></circle>
                    <line
                      stroke-width="7"
                      stroke="black"
                      y2="111.784"
                      x2="97.7088"
                      y1="67.7837"
                      x1="61.7089"
                    ></line>
                  </svg>
                </div>
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
              <div className="cardFraquezas">
                <div className="wrapCard">
                  <div className="terminal">
                    <hgroup className="head">
                      <p className="title">
                        <svg
                          width="16px"
                          height="16px"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke-linejoin="round"
                          stroke-linecap="round"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                        >
                          <path
                            d="M7 15L10 12L7 9M13 15H17M7.8 21H16.2C17.8802 21 18.7202 21 19.362 20.673C19.9265 20.3854 20.3854 19.9265 20.673 19.362C21 18.7202 21 17.8802 21 16.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21Z"
                          ></path>
                        </svg>
                        Terminal
                      </p>

                      <button className="copy_toggle" type="button">
                        <svg
                          width="16px"
                          height="16px"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          stroke-linejoin="round"
                          stroke-linecap="round"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                        >
                          <path
                            d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"
                          ></path>
                          <path
                            d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"
                          ></path>
                        </svg>
                      </button>
                    </hgroup>

                    <div className="bodyCard">
                      <pre className="pre">          <code>-&nbsp;</code>
                        <code>npx&nbsp;</code>
                        <code className="cmd" data-cmd="create-melhorMétodoParaEstudo-app@flashminder"></code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="book">
                <div className="book__pg-shadow"></div>
                <div className="book__pg"></div>
                <div className="book__pg book__pg--2"></div>
                <div className="book__pg book__pg--3"></div>
                <div className="book__pg book__pg--4"></div>
                <div className="book__pg book__pg--5"></div>
              </div>
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
