import React, { useEffect, useRef } from 'react';
import { IonPage, IonContent, IonImg, IonIcon, IonLabel, IonRow } from '@ionic/react';
import { library, brush, book, school, accessibility, earth, leaf, flask, planet, calculator, star } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import './css/darkmode.css';
import Header from '../../components/Header';
import AnimacaoSVG from '../../components/AnimacaoSVG';
import ThemeManager from '../../utils/ThemeManager';
import '../../utils/css/variaveisCores.css';

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
    <>
    <ThemeManager />
    <IonPage className="pagina">
        <Header />
        
        <IonContent>
          <div id="bodyHome">

          <section id="s5">
            <IonRow className="ion-justify-content-center ion-padding">
              <IonIcon icon="star" className="iconEstrela" />
              <IonIcon icon="star" className="iconEstrela" />
              <IonIcon icon="star" className="iconEstrela" />
              <IonIcon icon="star" className="iconEstrela" />
              <IonIcon icon="star" className="iconEstrela" />
            </IonRow>

            <IonRow className="ion-justify-content-center ion-padding">
              <div className="txtCentro2">
              <h2 className="pDarkmode titulo">
                Pare de esquecer tudo o que você{" "}
                <span className="txtAprendeu">já aprendeu.</span>
              </h2>
              </div>
            </IonRow>

            <IonRow className="ion-justify-content-center ion-padding">
            <div className="txtCentro2">
              <p className="pDarkmode subtitulo">
                Realize revisões, atividades e tenha uma agenda inteligente.
              </p>
            </div>
            </IonRow>

            <div className="hidden lg:block relative" >
              <div
                className="infinite absolute z-[1] flex animate-float rounded-full bg-white p-4 ease-in-out"
                style={{ left: "-2rem", top: "1rem", animationDelay: "0.359605s" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-test-tube-diagonal stroke-current size-8 text-primary"
                  aria-hidden="true"
                  data-testid="lucide-test-tube-diagonal"
                >
                  <path d="M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3"></path>
                  <path d="m16 2 6 6"></path>
                  <path d="M12 16H4"></path>
                </svg>
              </div>

              <div
                className="infinite absolute z-[1] flex animate-float rounded-full bg-white p-4 ease-in-out sumir"
                style={{ left: "4rem", top: "-5rem", animationDelay: "0.712048s" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-atom stroke-current size-12 text-quinary svgFlutuante"
                  aria-hidden="true"
                  data-testid="lucide-atom"
                >
                  <circle cx="12" cy="12" r="1"></circle>
                  <path d="M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"></path>
                  <path d="M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"></path>
                </svg>
              </div>

              <div
                className="infinite absolute z-[1] flex animate-float rounded-full bg-white p-4 ease-in-out"
                style={{ left: "-6rem", top: "-9rem", animationDelay: "1.03126s" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-spell-check stroke-current size-6 text-tertiary-10 svgFlutuante"
                  aria-hidden="true"
                  data-testid="lucide-spell-check"
                >
                  <path d="m6 16 6-12 6 12"></path>
                  <path d="M8 12h8"></path>
                  <path d="m16 20 2 2 4-4"></path>
                </svg>
              </div>

              <div
                className="infinite absolute z-[1] flex animate-float rounded-full bg-white p-4 ease-in-out"
                style={{ left: "0rem", top: "-15rem", animationDelay: "0.980146s" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-radical stroke-current size-8 text-secondary svgFlutuante"
                  aria-hidden="true"
                  data-testid="lucide-radical"
                >
                  <path d="M3 12h3.28a1 1 0 0 1 .948.684l2.298 7.934a.5.5 0 0 0 .96-.044L13.82 4.771A1 1 0 0 1 14.792 4H21"></path>
                </svg>
              </div>

              <div
                className="infinite absolute z-[1] flex animate-float rounded-full bg-white p-4 ease-in-out"
                style={{ right: "-2rem", top: "0rem", animationDelay: "1.0243s" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-scroll stroke-current size-12 text-quaternary svgFlutuante"
                  aria-hidden="true"
                  data-testid="lucide-scroll"
                >
                  <path d="M19 17V5a2 2 0 0 0-2-2H4"></path>
                  <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"></path>
                </svg>
              </div>

              <div
                className="infinite absolute z-[1] flex animate-float rounded-full bg-white p-4 ease-in-out sumir"
                style={{ right: "4rem", top: "-8rem", animationDelay: "0.0434575s" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-dna stroke-current size-8 text-primary svgFlutuante"
                  aria-hidden="true"
                  data-testid="lucide-dna"
                >
                  <path d="m10 16 1.5 1.5"></path>
                  <path d="m14 8-1.5-1.5"></path>
                  <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"></path>
                  <path d="m16.5 10.5 1 1"></path>
                  <path d="m17 6-2.891-2.891"></path>
                  <path d="M2 15c6.667-6 13.333 0 20-6"></path>
                  <path d="m20 9 .891.891"></path>
                  <path d="M3.109 14.109 4 15"></path>
                  <path d="m6.5 12.5 1 1"></path>
                  <path d="m7 18 2.891 2.891"></path>
                  <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"></path>
                </svg>
              </div>

              <div
                className="infinite absolute z-[1] flex animate-float rounded-full bg-white p-4 ease-in-out"
                style={{ right: "-6rem", top: "-11rem", animationDelay: "1.5279s" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-book-open stroke-current size-6 text-secondary svgFlutuante"
                  aria-hidden="true"
                  data-testid="lucide-book-open"
                >
                  <path d="M12 7v14"></path>
                  <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
                </svg>
              </div>

              <div
                className="infinite absolute z-[1] flex animate-float rounded-full bg-white p-4 ease-in-out"
                style={{ right: "0rem", top: "-16rem", animationDelay: "0.788296s" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-earth stroke-current size-8 text-tertiary-10 svgFlutuante"
                  aria-hidden="true"
                  data-testid="lucide-earth"
                >
                  <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"></path>
                  <path d="M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17"></path>
                  <path d="M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                </svg>
              </div>
            </div>
          </section>

            <section id="s1">
              <div id="divTxtHome">
                <div className="titulo1"><h1 className="titulo pDarkmode">Pronto para começar seus estudos?</h1></div>
                <div className="titulo2"><h2 className="subtitulo pDarkmode">Turbine seus estudos ao criar um cronograma de estudos adaptado a sua rotina.</h2></div>
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
                <div className="titulo3"><h1 className="titulo pDarkmode">Aprenda qualquer matéria.</h1></div>
                <div className="titulo4"><h2 className="subtitulo pDarkmode">Você está no comando! Adicone conteúdo de geografia à física.</h2></div>
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
    </>
  );
};

export default Home;
