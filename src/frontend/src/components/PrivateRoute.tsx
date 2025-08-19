// src/components/PrivateRoute.tsx

import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { IonPage, IonLoading } from '@ionic/react';
import { useUserProfile } from '../contexts/UserProfileContext';

// Estendemos RouteProps para aceitar nosso 'component'
interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<any>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  // Usamos o nosso contexto para saber o status real da autenticação
  const { userProfile, isLoadingProfile } = useUserProfile();

  // 1. ESTADO DE CARREGANDO
  // Enquanto o contexto está verificando o usuário na API, mostramos uma tela de loading.
  // Isso evita o "flash" da tela de login e o loop.
  if (isLoadingProfile) {
    return (
      <IonPage>
        <IonLoading isOpen={true} message={'Verificando autenticação...'} />
      </IonPage>
    );
  }

  // 2. ESTADO NÃO AUTENTICADO
  // Se a verificação terminou (isLoadingProfile é false) e não há usuário,
  // então redirecionamos para o login.
  if (!userProfile) {
    return <Redirect to="/logincadastro/logincadastro" />;
  }

  // 3. ESTADO AUTENTICADO
  // Se a verificação terminou e TEMOS um usuário,
  // renderizamos a página que foi solicitada.
  return <Route {...rest} render={props => <Component {...props} />} />;
};

export default PrivateRoute;