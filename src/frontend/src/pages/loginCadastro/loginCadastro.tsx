import React, { useRef } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

import Registro from '../registro/Registro';
import Login from '../login/Login';
import './LoginCadastro.css';

SwiperCore.use([Pagination]);

const LoginCadastro: React.FC = () => {
  const swiperRef = useRef<any>(null);

  // Função para ir para o slide de cadastro
  const goToCadastro = () => {
    swiperRef.current.swiper.slideTo(0); // 0 é o índice do slide de cadastro
  };

  // Função para ir para o slide de login
  const goToLogin = () => {
    swiperRef.current.swiper.slideTo(1); // 1 é o índice do slide de login
  };

  return (
    <IonPage>
      <IonContent>
        <Swiper
          ref={swiperRef}
          pagination={{ clickable: true }}
          spaceBetween={50}
          slidesPerView={1}
        >
          <SwiperSlide>
            {/* Passando a função goToLogin como props para o componente Registro */}
            <Registro goToLogin={goToLogin} />
          </SwiperSlide>
          <SwiperSlide>
            {/* Passando a função goToCadastro como props para o componente Login */}
            <Login goToCadastro={goToCadastro} />
          </SwiperSlide>
        </Swiper>
      </IonContent>
    </IonPage>
  );
};

export default LoginCadastro;
