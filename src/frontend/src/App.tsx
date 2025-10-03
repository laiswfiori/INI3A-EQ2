import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { SoundProvider } from './utils/Som';
import { AuthProvider } from './contexts/AuthContext';

// Imports de páginas
import Home from './pages/pagInicial/Home';
// Login e Registro foram removidos daqui, pois serão gerenciados por LoginCadastro
import LoginCadastro from './pages/loginCadastro/loginCadastro';
import Matérias from './pages/conteudos/materias/Materias';
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
import Estudo from './pages/estudo/Estudo';

/* Core CSS */
import '@ionic/react/css/core.css';
/* Basic CSS */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
/* Optional CSS */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
/* Dark Mode */
import '@ionic/react/css/palettes/dark.system.css';
/* Theme variables */
import './theme/variables.css';
import { useEffect } from 'react';
import idioma from './utils/idioma';

setupIonicReact();

const App: React.FC = () => {
  idioma();

  return (
    <IonApp>
      <AuthProvider>
        <SoundProvider>
          <IonReactRouter>
            <IonRouterOutlet>
              {/* ROTA PAI PARA AUTENTICAÇÃO - SEM 'exact' */}
              <Route path="/auth" component={LoginCadastro} />

              {/* Mantenha suas outras rotas aqui */}
              <Route path="/pagInicial/home" component={Home} exact />
              <Route path="/conteudos/materias" component={Matérias} exact />
              <Route path="/conteudos/topicos" component={Topicos} exact />
              <Route path="/conteudos/atividades" component={Atividades} exact />
              <Route path="/conteudos/atividade" component={Atividade} exact />
              <Route path="/perfil/perfil" component={Perfil} exact />
              <Route path="/configuracoes/configuracoes" component={Configuracoes} exact />
              <Route path="/agenda/agenda" component={Agenda} exact />
              <Route path="/flashcards/flashcards" component={Flashcards} exact />
              <Route path="/flashcards/telainicialflashcards" component={TelaInicialFlashcards} exact />
              <Route path="/flashcards/relatorio" component={Relatorio} exact />
              <Route path="/senha/confirmar" component={Confirmar} exact />
              <Route path="/senha/concluir" component={Concluir} exact />
              <Route path="/senha/alterar" component={Alterar} exact />
              <Route path="/estudo/estudo" component={Estudo} exact />

              {/* Rotas com parâmetros */}
              <Route path="/materias/:id" component={Topicos} exact />
              <Route path="/topicos/:id" component={Atividades} exact />
              <Route path="/atividades/:id" component={Atividade} exact />
              <Route path="/flashcard/revisaoGeral" component={RevisaoGeral} exact />
              <Route path="/flashcard/materia/:id" component={CardsMateria} exact />
              <Route path="/flashcard/:id(\d+)" component={Flashcards} exact />

              {/* REDIRECIONAMENTO INICIAL */}
              <Route exact path="/">
                {/* Redireciona para a página de login ao abrir o app */}
                <Redirect to="/auth/login" />
              </Route>

            </IonRouterOutlet>
          </IonReactRouter>
        </SoundProvider>
      </AuthProvider>
    </IonApp>
  );
};

export default App;
