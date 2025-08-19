import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import PrivateRoute from './components/PrivateRoute';
import { SoundProvider } from './utils/Som';
import { UserProfileProvider } from './contexts/UserProfileContext';

import Home from './pages/pagInicial/Home';
import Login from './pages/login/Login';
import Registro from './pages/registro/Registro';
import LoginCadastro from './pages/loginCadastro/loginCadastro';
import Matérias from './pages/conteudos/matérias/Materias';
import Topicos from './pages/conteudos/topicos/Topicos';
import Atividades from './pages/conteudos/atividades/Atividades';
import Atividade from './pages/conteudos/atividadeVisualizacao/Atividade';
import Perfil from './pages/perfil/Perfil';
import Configuracoes from './pages/configuracoes/Configuracoes';
import Agenda from './pages/agenda/Agenda';
import Flashcards from './pages/flashcards/flashcard/Flashcards';
import CardsMateria from './pages/flashcards/flashcard/CardsMateria';
import RevisaoGeral from './pages/flashcards/flashcard/RevisaoGeral';
import TelaInicialFlashcards from './pages/flashcards/telaInicial/TelaInicialFlashcards';
import Relatorio from './pages/flashcards/relatorio/Relatorio';
import Confirmar from './pages/senha/confirmar/Confirmar';
import Concluir from './pages/senha/concluir/Concluir';
import Alterar from './pages/senha/alterar/Alterar';

import Teste from './pages/perfil/Teste';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';


/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';


/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';


/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */


/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';


/* Theme variables */
import './theme/variables.css';
import { useEffect } from 'react';
import idioma from './utils/idioma';


setupIonicReact();


const App: React.FC = () => {
  idioma();

  return (
    <UserProfileProvider>
      <IonApp>
        <SoundProvider>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route path="/pagInicial/home" component={Home} exact />
              <Route path="/login/login" component={Login} exact />
              <Route path="/registro/registro" component={Registro} exact />
              <Route path="/logincadastro/logincadastro" component={LoginCadastro} exact />

              <Route path="/senha/confirmar" component={Confirmar} exact />
              <Route path="/senha/concluir" component={Concluir} exact />
              <Route path="/senha/alterar" component={Alterar} exact />

              <PrivateRoute path="/conteudos/materias" component={Matérias} exact />
              <PrivateRoute path="/conteudos/topicos" component={Topicos} exact />
              <PrivateRoute path="/conteudos/atividades" component={Atividades} exact />
              <PrivateRoute path="/conteudos/atividade" component={Atividade} exact />
              <PrivateRoute path="/perfil/perfil" component={Perfil} exact />
              <PrivateRoute path="/configuracoes/configuracoes" component={Configuracoes} exact />
              <PrivateRoute path="/agenda/agenda" component={Agenda} exact />
              <PrivateRoute path="/flashcards/flashcards" component={Flashcards} exact />
              <PrivateRoute path="/flashcards/telainicialflashcards" component={TelaInicialFlashcards} exact />
              <PrivateRoute path="/flashcards/relatorio" component={Relatorio} exact />

              <PrivateRoute path="/materias/:id" component={Topicos} exact />
              <PrivateRoute path="/topicos/:id" component={Atividades} exact />
              <PrivateRoute path="/atividades/:id" component={Atividade} exact />

              <PrivateRoute path="/flashcard/revisaoGeral" component={RevisaoGeral} exact />
              <PrivateRoute path="/flashcard/materia/:id" component={CardsMateria} exact />
              <PrivateRoute path="/flashcard/:id(\d+)" component={Flashcards} exact />

              <PrivateRoute path="/perfil/teste" component={Teste} exact />

              <Route exact path="/">
                <Redirect to="/pagInicial/home" />
              </Route>
            </IonRouterOutlet>
          </IonReactRouter>
        </SoundProvider>
      </IonApp>
    </UserProfileProvider>
  );
};

export default App;