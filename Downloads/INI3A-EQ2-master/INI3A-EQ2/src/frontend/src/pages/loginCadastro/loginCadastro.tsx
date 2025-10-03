import React, { useRef } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules'; // Importação atualizada para Swiper v11+
import 'swiper/css';
import 'swiper/css/pagination';

import Registro from '../registro/Registro';
import Login from '../login/Login';
import './loginCadastro.css';

// A inicialização dos módulos agora é feita no componente Swiper
// SwiperCore.use([Pagination]); // Esta forma é legada

const LoginCadastro: React.FC = () => {
  // useRef para obter controle programático sobre o Swiper
  const swiperRef = useRef<any>(null);

  // Função para navegar para o slide de Registro (índice 0)
  const goToCadastro = () => {
    swiperRef.current?.swiper.slideTo(0);
  };

  // Função para navegar para o slide de Login (índice 1)
  const goToLogin = () => {
    swiperRef.current?.swiper.slideTo(1);
  };

  return (
    <IonPage>
      <IonContent>
        {/* O container principal para o Swiper */}
        <div id="conteudo">
          <Swiper
            ref={swiperRef}
            // Módulos são passados como props
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={50}
            slidesPerView={1}
          >
            <SwiperSlide>
              {/* O componente Registro recebe a função para navegar para o Login */}
              <Registro goToLogin={goToLogin} />
            </SwiperSlide>
            <SwiperSlide>
              {/* O componente Login recebe a função para navegar para o Cadastro */}
              <Login goToCadastro={goToCadastro} />
            </SwiperSlide>
          </Swiper>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LoginCadastro;

