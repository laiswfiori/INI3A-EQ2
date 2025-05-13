import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/pagInicial/Home';
import Conteudos from './pages/topicos/conteudos/Conteudos';
import Atividades from './pages/topicos/atividades/Atividades';
import Matérias from './pages/topicos/matérias/Materias';
import Login from './pages/login/Login';
import LoginCadastro from './pages/loginCadastro/loginCadastro';
import Registro from './pages/registro/Registro';
import Configuracoes from './pages/configuracoes/Configuracoes';
import Agenda from './pages/agenda/Agenda';
import Flashcards from './pages/flashcards/Flashcards';
import TelaInicialFlashcards from './pages/flashcards/TelaInicialFlashcards';


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


setupIonicReact();


const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/pagInicial/home" component={Home} exact />
        <Route path="/topicos/conteudos" component={Conteudos} exact />
        <Route path="/topicos/atividades" component={Atividades} exact />
        <Route path="/topicos/materias" component={Matérias} exact />
        <Route path="/login/login" component={Login} exact />
        <Route path="/registro/registro" component={Registro} exact />
        <Route path="/configuracoes/configuracoes" component={Configuracoes} exact />
        <Route path="/agenda/agenda" component={Agenda} exact />
        <Route path="/flashcards/flashcards" component={Flashcards} exact />
        <Route path="/flashcards/telainicialflashcards" component={TelaInicialFlashcards} exact />
        <Route path="/logincadastro" component={LoginCadastro} exact />

        <Route path="/materias/:id" component={Conteudos} exact />

        {}
        <Route exact path="/">
          <Redirect to="/pagInicial/home" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);


export default App;