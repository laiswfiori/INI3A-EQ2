import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';

// Este componente verifica se o usuário tem um token salvo.
// Se tiver, ele mostra a página que o usuário pediu.
// Se não tiver, ele redireciona para a tela de login.
const PrivateRoute: React.FC<RouteProps> = ({ component: Component, ...rest }) => {
  
  // 1. Pega o token do armazenamento local do navegador
  const token = localStorage.getItem('token');

  // Garante que o componente a ser renderizado foi passado corretamente
  if (!Component) {
    return null;
  }

  // 2. Renderiza a rota
  return (
    <Route
      {...rest}
      render={props =>
        // 3. A decisão:
        token ? (
          // Se TEM token, mostra a página (ex: Perfil)
          <Component {...props} />
        ) : (
          // Se NÃO TEM token, redireciona para o login
          <Redirect to="/logincadastro/logincadastro" />
        )
      }
    />
  );
};

export default PrivateRoute;