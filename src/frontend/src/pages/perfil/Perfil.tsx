import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { 
  IonPage, IonContent, IonCol, IonRow, IonIcon, IonButton, 
  IonInput, IonCheckbox, IonTextarea, IonAlert, IonSpinner, 
  IonItem, IonLabel, useIonRouter 
} from '@ionic/react';
import { caretForward, personCircle, warning, logOut, chevronDown } from 'ionicons/icons';
import { 
  getUserProfile, updateUserProfile, changeUserPassword, 
  deleteUserAccount, getAgendaConfiguracoes, 
  saveAgendaConfiguracoes, getMaterias 
} from '../../lib/endpoints';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import './css/switch.css';
import Header from '../../components/Header';
import { useSoundPlayer } from '../../utils/Som';

// Interfaces
interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  biography: string;
}

interface Materia {
  id: number;
  nome: string;
}

interface HorarioEstudo {
  dia_semana: string;
  horario_inicio: string;
  horario_fim: string;
  materias: { id: number }[]; 
}

const Perfil: React.FC = () => {
  // Hooks and routing
  const history = useHistory();
  const ionRouter = useIonRouter();
  const { somAtivo, toggleSom } = useSoundPlayer();

  // State management
  const [isChecked, setIsChecked] = useState(false);
  const [view, setView] = useState<'perfil' | 'estudo'>('perfil');
  const [mobileView, setMobileView] = useState<'gerais' | 'perfil' | 'seguranca' | 'estudo'>('gerais');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [userData, setUserData] = useState<User | null>(null);
  const [showAlert, setShowAlert] = useState<{show: boolean, message: string}>({show: false, message: ''});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [materias, setMaterias] = useState<string[]>(['Matéria 1', 'Matéria 2']);
  const [materiasAbertas, setMateriasAbertas] = useState<{ [key: string]: boolean }>({});
  const [horariosEstudo, setHorariosEstudo] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    senha_atual: '',
    nova_senha: '',
    confirmar_senha: ''
  });

  // Study configuration state
  const [periodoEstudo, setPeriodoEstudo] = useState({
    inicio: '',
    fim: ''
  });
  const [horariosDeEstudo, setHorariosDeEstudo] = useState<HorarioEstudo[]>([]);
  const [diasSemana, setDiasSemana] = useState(['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']);
  const [materiasDisponiveis, setMateriasDisponiveis] = useState<Materia[]>([]);

  // Settings state
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'pt';
  });
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(() => {
    return localStorage.getItem('notificacoesAtivas') !== 'false';
  });

  // Effects
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setAuthError(true);
        setIsLoading(false);
        history.push('/logincadastro/logincadastro');
        return;
      }

      try {
        const profileData = await getUserProfile();
        setUserData(profileData);
      } catch (error: any) {
        if (error.message && error.message.includes('401')) {
          setAuthError(true);
          localStorage.removeItem('token');
          history.push('/logincadastro/logincadastro');
        } else {
          console.error('Erro ao buscar perfil:', error);
          setShowAlert({ show: true, message: 'Não foi possível carregar os dados do perfil.' });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [history]);

  useEffect(() => {
    const carregarMaterias = async () => {
      try {
        const materias = await getMaterias();
        setMateriasDisponiveis(materias);
      } catch (error) {
        console.error("Erro ao carregar matérias:", error);
      }
    };
    carregarMaterias();
  }, []);

  useEffect(() => {
    const carregarConfiguracoes = async () => {
      try {
        const user = await getUserProfile();
        setUserData(user);

        const config = await getAgendaConfiguracoes();

        if (config?.dias_disponiveis) {
          const dias: HorarioEstudo[] = config.dias_disponiveis.map((dia: any) => ({
            dia_semana: dia.dia_semana.charAt(0).toUpperCase() + dia.dia_semana.slice(1) + '-feira',
            horario_inicio: dia.hora_inicio,
            horario_fim: dia.hora_fim,
            materias: dia.materia_id ? [{ id: dia.materia_id }] : []
          }));
          setHorariosDeEstudo(dias);
          setPeriodoEstudo({
            inicio: config.data_inicio || '',
            fim: config.data_fim || ''
          });
        }
      } catch (error) {
        console.error("Erro ao carregar configurações da agenda:", error);
      }
    };

    carregarConfiguracoes();
  }, []);

  // Google Translate functions
  const changeGoogleTranslateLanguage = (langCode: string) => {
    const select = document.querySelector<HTMLSelectElement>('.goog-te-combo');
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event('change'));
    }
  };

  useEffect(() => {
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: 'pt',
          includedLanguages: 'en,pt',
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        'google_translate_element'
      );
      setTimeout(() => {
        changeGoogleTranslateLanguage(language);
      }, 500);
    };

    const existingScript = document.getElementById('google-translate-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    } else {
      if ((window as any).google && (window as any).google.translate) {
        changeGoogleTranslateLanguage(language);
      }
    }
  }, []); 

  useEffect(() => {
    if ((window as any).google && (window as any).google.translate) {
      changeGoogleTranslateLanguage(language);
    }
  }, [language]);

  // Helper functions
  const toggleMateriaAberta = (materia: string) => {
    setMateriasAbertas(prev => ({
      ...prev,
      [materia]: !prev[materia]
    }));
  };

  const handleHorarioChange = (dia: string, valor: string) => {
    setHorariosEstudo(prev => ({ ...prev, [dia]: valor }));
  };

  const handleCheckboxChange = (e: CustomEvent) => {
    setIsChecked(e.detail.checked);
  };

  const toggleDia = (dia: string) => {
    if (!dia.includes('-')) {
      setHorariosDeEstudo(prev => {
        const existe = prev.some(h => h.dia_semana === dia);
        if (existe) {
          return prev.filter(h => h.dia_semana !== dia);
        } else {
          const novoHorario = { dia_semana: dia, horario_inicio: '', horario_fim: '', materias: [] };
          return [...prev, novoHorario].sort((a, b) => diasSemana.indexOf(a.dia_semana) - diasSemana.indexOf(b.dia_semana));
        }
      });
    }

    setDiasSelecionados(prev => {
      const isSelected = prev.includes(dia);
      if (isSelected) {
        return prev.filter(d => d !== dia);
      } else {
        return [...prev, dia];
      }
    });
  };

  const handleDiaToggle = (dia: string) => {
    setHorariosDeEstudo(prev => {
      const existe = prev.some(h => h.dia_semana === dia);
      if (existe) {
        return prev.filter(h => h.dia_semana !== dia);
      } else {
        const novoHorario: HorarioEstudo = { dia_semana: dia, horario_inicio: '', horario_fim: '', materias: [] };
        return [...prev, novoHorario].sort((a, b) => diasSemana.indexOf(a.dia_semana) - diasSemana.indexOf(b.dia_semana));
      }
    });
  };

  const handleTimeChange = (dia: string, tipo: 'inicio' | 'fim', valor: string) => {
    setHorariosDeEstudo(prev => prev.map(h => 
      h.dia_semana === dia ? { ...h, [tipo === 'inicio' ? 'horario_inicio' : 'horario_fim']: valor } : h
    ));
  };

  const handleMateriaSelect = (dia: string, materiaId: number) => {
    setHorariosDeEstudo(prev =>
      prev.map(h => {
        if (h.dia_semana === dia) {
          const materiaExiste = h.materias.some(m => m.id === materiaId);
          const novasMaterias = materiaExiste
            ? h.materias.filter(m => m.id !== materiaId)
            : [...h.materias, { id: materiaId }];
          return { ...h, materias: novasMaterias };
        }
        return h;
      })
    );
  };

  // User actions
  const logout = () => {
    localStorage.removeItem('token');
    history.push('/logincadastro/logincadastro');
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    if (userData) {
      setUserData({ ...userData, [name]: value });
    }
  };

  const handleSaveProfile = async () => {
    if (!userData) return;
    try {
      const response = await updateUserProfile(userData);
      setUserData(response.user);
      setShowAlert({ show: true, message: response.message || 'Perfil atualizado com sucesso!' });
    } catch (error) {
      console.error('Erro ao salvar o perfil:', error);
      setShowAlert({ show: true, message: 'Não foi possível salvar as alterações.' });
    }
  };

  const handlePasswordInputChange = (event: any) => {
    const { name, value } = event.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handlePasswordChange = async () => {
    if (passwordData.nova_senha !== passwordData.confirmar_senha) {
      setShowAlert({ show: true, message: 'A nova senha e a confirmação não correspondem.' });
      return;
    }
    if (!passwordData.nova_senha || !passwordData.senha_atual) {
      setShowAlert({ show: true, message: 'Por favor, preencha todos os campos de senha.' });
      return;
    }
    try {
      const response = await changeUserPassword(passwordData);
      setShowAlert({ show: true, message: response.message || 'Senha alterada com sucesso!' });
      setPasswordData({
        senha_atual: '',
        nova_senha: '',
        confirmar_senha: ''
      });
    } catch (error: any) {
      console.error('Erro ao alterar a senha:', error);
      const errorMessage = error.message || 'Não foi possível alterar a senha.';
      setShowAlert({ show: true, message: errorMessage });
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const executeAccountDeletion = async () => {
    try {
      await deleteUserAccount();
      localStorage.removeItem('token');
      history.push('/logincadastro/logincadastro');
      alert('Sua conta foi excluída com sucesso.');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Não foi possível excluir a conta.';
      setShowAlert({ show: true, message: errorMessage });
    }
  };

  const handleSalvar = async () => {
    if (horariosDeEstudo.some(h => !h.horario_inicio || !h.horario_fim)) {
      setShowAlert({ show: true, message: 'Preencha o horário de início e fim para todos os dias.' });
      return;
    }

    if (!periodoEstudo.inicio || !periodoEstudo.fim) {
      setShowAlert({ show: true, message: 'Preencha o período total de estudo.' });
      return;
    }

    const dias_disponiveis = horariosDeEstudo.map(h => ({
      dia_semana: h.dia_semana.toLowerCase().replace('-feira', '').trim(),
      hora_inicio: h.horario_inicio,
      hora_fim: h.horario_fim,
      materia_id: h.materias.length > 0 ? h.materias[0].id : null,
    }));

    const payload = {
      data_inicio: periodoEstudo.inicio,
      data_fim: periodoEstudo.fim,
      dias_disponiveis,
    };

    try {
      await saveAgendaConfiguracoes(payload);
      setShowAlert({ show: true, message: 'Configurações salvas com sucesso!' });
    } catch (error: any) {
      setShowAlert({ show: true, message: error.data?.message || 'Erro ao salvar as configurações.' });
    }
  };

  // Settings functions
  const toggleNotificacoes = (checked: boolean) => {
    setNotificacoesAtivas(checked);
    localStorage.setItem('notificacoesAtivas', checked.toString());
  };

  const resetarConfiguracoes = () => {
    if (!somAtivo) {
      toggleSom();
    }
    localStorage.setItem('somAtivo', 'true'); 
    setNotificacoesAtivas(true);
    localStorage.setItem('notificacoesAtivas', 'true');
  };

  // Loading states
  if (isLoading || authError) {
    return (
      <IonPage>
        <Header />
        <IonContent fullscreen className="ion-text-center ion-padding">
          <IonSpinner name="crescent" />
          <p>Carregando...</p>
        </IonContent>
      </IonPage>
    );
  }

  if (!userData) {
    return (
      <IonPage>
        <Header />
        <IonContent fullscreen className="ion-text-center ion-padding">
          <p>Não foi possível carregar os dados do perfil.</p>
          <p>Por favor, tente recarregar a página.</p>
        </IonContent>
      </IonPage>
    );
  }

  // Render functions
  const renderDesktopView = () => (
    <IonRow id="lDesktop" className="pagPerfil">
      <IonCol className="ladoPerfil">
        <IonRow id="img">
          <IonIcon icon={personCircle} id="iconePerfil" />
          <div id="txtOi">
            <p className="txtPading">Olá, {userData?.name}.</p>
          </div>
        </IonRow>
        <IonRow id="linhaDivisora"></IonRow>
        <IonRow id="configs">
          <h1>Configurações gerais</h1>
          <IonRow id="dBranco">
            {/* Theme toggle */}
            <IonRow className="rowContainer">
              <div className="contConfig">
                <div className="cor" id="tema"></div>
                <p className="titConfig">Tema:</p>
              </div>
              <label className="switch">
                <input defaultChecked={true} id="checkbox" type="checkbox" />
                <span className="sliderr">
                  <div className="star star_1"></div>
                  <div className="star star_2"></div>
                  <div className="star star_3"></div>
                  <svg viewBox="0 0 16 16" className="cloud_1 cloud">
                    <path
                      transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                      fill="#fff"
                      d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                    />
                  </svg>
                </span>
              </label>
            </IonRow>
            
            {/* Sound toggle */}
            <IonRow className="rowContainer">
              <div className="contConfig">
                <div className="cor" id="som" />
                <p className="titConfig">Som:</p>
              </div>
              <div className="toggleWrapper">
                <input
                  type="checkbox"
                  id="checkboxInput"
                  checked={!somAtivo} 
                  onChange={(e) => toggleSom()}
                />
                <label htmlFor="checkboxInput" className="toggleSwitch">
                  <div className={`speaker ${somAtivo ? 'visivel' : 'oculto'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 75">
                      <path d="M39.389 13.769 22.235 28.606 6 28.606v19.093h15.989L39.389 62.75V13.769z"
                        style={{ stroke: '#fff', strokeWidth: 5, strokeLinejoin: 'round', fill: '#fff' }} />
                      <path d="M48 27.6a19.5 19.5 0 0 1 0 21.4M55.1 20.5a30 30 0 0 1 0 35.6M61.6 14a38.8 38.8 0 0 1 0 48.6"
                        style={{ fill: 'none', stroke: '#fff', strokeWidth: 5, strokeLinecap: 'round' }} />
                    </svg>
                  </div>
                  <div className={`mute-speaker ${somAtivo ? 'oculto' : 'visivel'}`}>
                    <svg viewBox="0 0 75 75" stroke="#fff" strokeWidth={5}>
                      <path d="M39 14 22 29H6v19h16l17 15z" fill="#fff" strokeLinejoin="round" />
                      <path d="M49 26 69 50M69 26 49 50" fill="#fff" strokeLinecap="round" />
                    </svg>
                  </div>
                </label>
              </div>
            </IonRow>
            
            {/* Language selection */}
            <IonRow className="rowContainer">
              <div className="contConfig">
                <div className="cor" id="idioma"></div>
                <p className="titConfig">Idioma:</p>
              </div>
              <div className="containerIdioma">
                <form>
                  <label>
                    <input
                      type="radio"
                      name="language"
                      checked={language === 'pt'}
                      onChange={() => setLanguage('pt')}
                    />
                    <span>Português</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="language"
                      checked={language === 'en'}
                      onChange={() => setLanguage('en')}
                    />
                    <span>Inglês</span>
                  </label>
                </form>
              </div>
            </IonRow>

            <div id="google_translate_element" style={{ width: 0, height: 0, overflow: 'hidden', position: 'absolute' }}></div>

            {/* Notifications toggle */}
            <IonRow className="rowContainer">
              <div className="contConfig">
                <div className="cor" id="notificacoes"></div>
                <p className="titConfig">Notificações:</p>
              </div>
              <label className="containerNotif">
                <input
                  type="checkbox"
                  checked={notificacoesAtivas}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setNotificacoesAtivas(checked);
                    localStorage.setItem('notificacoesAtivas', checked.toString());
                  }}
                />
                <svg
                  className={`bell-regular ${notificacoesAtivas ? 'oculto' : 'visivel'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
                </svg>
                <svg
                  className={`bell-solid ${notificacoesAtivas ? 'visivel' : 'oculto'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                </svg>
              </label>
            </IonRow>
            
            {/* Reset settings */}
            <IonRow className="rowContainer">
              <div className="contConfig">
                <div className="cor" id="resetar"></div>
                <p className="titConfig">Resetar:</p>
              </div>
              <button className="bin-button" onClick={resetarConfiguracoes}>
                <svg className="bin-top" viewBox="0 0 39 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line y1={5} x2={39} y2={5} stroke="white" strokeWidth={4} />
                  <line x1={12} y1="1.5" x2="26.0357" y2="1.5" stroke="white" strokeWidth={3} />
                </svg>
                <svg className="bin-bottom" viewBox="0 0 33 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="path-1-inside-1_8_19" fill="white">
                    <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
                  </mask>
                  <path d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" fill="white" mask="url(#path-1-inside-1_8_19)" />
                  <path d="M12 6L12 29" stroke="white" strokeWidth={4} />
                  <path d="M21 6V29" stroke="white" strokeWidth={4} />
                </svg>
              </button>
            </IonRow>
          </IonRow>
          
          {/* Navigation buttons */}
          <IonRow className="containerConfig">
            <IonButton className="btnConfigg" onClick={(e) => {
              e.stopPropagation();
              setView('perfil');
            }}>
              Configurações de perfil
              <IonIcon icon={caretForward} className="iconesSeta" />
            </IonButton>
          </IonRow>
          <IonRow className="containerConfig">
            <IonButton className="btnConfigg" type="button" onClick={(e) => {
              e.stopPropagation();
              setView('estudo');
            }}>
              Configurações avançadas de estudo
              <IonIcon icon={caretForward} className="iconesSeta" />
            </IonButton>
          </IonRow>
          <IonRow className="containerConfig">
            <IonButton className="btnConfigg" type="button" onClick={(e) => {
              e.stopPropagation();
              logout();
            }}>
              <IonIcon icon={logOut} className="iconeSair" />
              Sair
            </IonButton>
          </IonRow>
        </IonRow>
      </IonCol>
      
      {/* Profile view */}
      {view === 'perfil' && (
        <IonCol className="ladoConfig">
          <div id="infos">
            <h1 className="preto" id="h1Titulo">Configurações de perfil</h1>
          </div>
          <div id="flexColunas">
            <IonCol className="colunasConfig">
              <p className="labelBio">Nome</p>
              <IonInput name="name" value={userData.name} onIonChange={handleInputChange} className="inputBio" />
              <p className="labelBio">Sobrenome</p>
              <IonInput name="surname" value={userData.surname} onIonChange={handleInputChange} className="inputBio" />
              <p className="labelBio">Email</p>
              <IonInput type="email" name="email" value={userData.email} onIonChange={handleInputChange} className="inputBio" />
              <p className="labelBio">Biografia</p>
              <IonTextarea name="biography" value={userData.biography || ''} onIonChange={handleInputChange} className="inputBio" placeholder="Escreva sobre você..." />
              <IonButton className="btnConfigBio" id="btnSalvarBio" onClick={handleSaveProfile}>Salvar</IonButton>
            </IonCol>
            <IonCol className="colunasConfig" id="col2">
              <p className="labelBio">Alterar senha</p>
              <IonInput
                className="inputBioSenha"
                label="Senha atual"
                labelPlacement="stacked"
                type="password"
                name="senha_atual"
                value={passwordData.senha_atual}
                onIonChange={handlePasswordInputChange}
              />
              <IonInput
                className="inputBioSenha"
                label="Nova senha"
                labelPlacement="stacked"
                type="password"
                name="nova_senha"
                value={passwordData.nova_senha}
                onIonChange={handlePasswordInputChange}
              />
              <IonInput
                className="inputBioSenha"
                label="Confirmar senha"
                labelPlacement="stacked"
                type="password"
                name="confirmar_senha"
                value={passwordData.confirmar_senha}
                onIonChange={handlePasswordInputChange}
              />
              <IonButton className="btnConfigBio" id="btnAlterarBio" onClick={handlePasswordChange}>
                Alterar
              </IonButton>
              <div id="excSenha">
                <IonRow className="msmLinha">
                  <IonCheckbox checked={isChecked} onIonChange={handleCheckboxChange} id="check" />
                  <p className="excp" id="boldExc">Deseja excluir sua conta?</p>
                </IonRow>
                <IonRow className="msmLinha">
                  <IonIcon icon={warning} className="iconesBio" />
                  <p className="excp">ATENÇÃO: essa ação não pode ser desfeita.</p>
                </IonRow>
                <IonRow>
                  <p className="excp">Ao confirmar essa ação, sua conta será apagada permanentemente e não poderá ser recuperada.</p>
                </IonRow>
                <IonRow>
                  <IonButton className="btnConfigBio" disabled={!isChecked} onClick={handleDeleteClick}>Confirmar</IonButton>
                </IonRow>
              </div>
            </IonCol>
          </div>
        </IonCol>
      )}
      
      {/* Study view */}
      {view === 'estudo' && (
        <IonCol>
          <h1 id="h1Titulo">Configurações avançadas de estudo</h1>
          
          {/* Study period */}
          <p style={{ marginTop: '20px', fontWeight: 'bold' }}>Período total de estudo:</p>
          <IonRow>
            <IonCol>
              <IonInput 
                label="Data de Início" 
                labelPlacement="stacked" 
                type="date" 
                value={periodoEstudo.inicio} 
                onIonChange={e => setPeriodoEstudo({...periodoEstudo, inicio: e.detail.value!})} 
              />
            </IonCol>
            <IonCol>
              <IonInput 
                label="Data de Término" 
                labelPlacement="stacked" 
                type="date" 
                value={periodoEstudo.fim} 
                onIonChange={e => setPeriodoEstudo({...periodoEstudo, fim: e.detail.value!})} 
              />
            </IonCol>
          </IonRow>
    
          {/* Day selection */}
          <p style={{ marginTop: '20px', fontWeight: 'bold' }}>1. Selecione os dias que você pode estudar:</p>
          <IonRow>
            {diasSemana.map(dia => (
              <IonCol size="12" size-sm="6" size-md="4" key={dia}>
                <IonItem lines="none">
                  <IonCheckbox
                    checked={horariosDeEstudo.some(h => h.dia_semana === dia)}
                    onIonChange={() => handleDiaToggle(dia)}
                  />
                  <IonLabel>{dia}</IonLabel>
                </IonItem>
              </IonCol>
            ))}
          </IonRow>
    
          {/* Time and subject configuration */}
          {horariosDeEstudo.map((horario, index) => (
            <div key={index} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '16px', padding: '16px' }}>
              <h3 style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '8px', marginBottom: '16px' }}>{horario.dia_semana}</h3>
              
              {/* Time setting */}
              <p style={{ fontWeight: 'bold' }}>2. Defina o horário:</p>
              <IonRow>
                <IonCol>
                  <IonInput label="Início" labelPlacement="stacked" type="time" value={horario.horario_inicio} onIonChange={e => handleTimeChange(horario.dia_semana, 'inicio', e.detail.value!)} />
                </IonCol>
                <IonCol>
                  <IonInput label="Fim" labelPlacement="stacked" type="time" value={horario.horario_fim} onIonChange={e => handleTimeChange(horario.dia_semana, 'fim', e.detail.value!)} />
                </IonCol>
              </IonRow>
    
              {/* Subject selection */}
              <p style={{ fontWeight: 'bold' }}>3. Selecione as matérias:</p>
              {materiasDisponiveis.map(materia => {
                const isSelected = horario.materias.some(m => m.id === materia.id);
    
                return (
                  <IonRow key={materia.id}>
                    <IonCol>
                      <IonItem lines="none">
                        <IonCheckbox
                          checked={isSelected}
                          onIonChange={() => handleMateriaSelect(horario.dia_semana, materia.id)}
                        />
                        <IonLabel>{materia.nome}</IonLabel>
                      </IonItem>
                    </IonCol>
                  </IonRow>
                );
              })}
            </div>
          ))}
    
          {/* Save button */}
          {horariosDeEstudo.length > 0 && (
            <IonButton expand="full" onClick={handleSalvar} style={{ marginTop: '16px' }}>
              Salvar Configurações de Estudo
            </IonButton>
          )}
        </IonCol>
      )}
    </IonRow>
  );

  const renderMobileView = () => (
    <IonRow id="lMobile" className="pagPerfilM">
      <IonRow id="imgM">
        <IonIcon icon={personCircle} id="iconePerfil" />
        <div id="txtOi">
          <p className="txtPading">Olá, {userData?.name}.</p>
        </div>
      </IonRow>
      <IonRow id="contOpsConfig">
        <IonRow id="opsConfig">
          <label className="radio">
            <input type="radio" name="radio" checked={mobileView === 'gerais'}
              onChange={() => setMobileView('gerais')} />
            <span className="name">Configurações gerais</span>
          </label>
          <label className="radio">
            <input type="radio" name="radio" checked={mobileView === 'perfil'}
              onChange={() => setMobileView('perfil')} />
            <span className="name">Configurações de perfil</span>
          </label>
          <label className="radio">
            <input type="radio" name="radio" checked={mobileView === 'seguranca'}
              onChange={() => setMobileView('seguranca')} />
            <span className="name">Configurações de segurança</span>
          </label>
          <label className="radio">
            <input type="radio" name="radio" checked={mobileView === 'estudo'}
              onChange={() => setMobileView('estudo')} />
            <span className="name">Configurações de estudo</span>
          </label>
        </IonRow>
      </IonRow>
      
      {/* General settings mobile */}
      {mobileView === 'gerais' && (
        <IonRow id="confGerais">
          <h1>Configurações gerais</h1>
          <IonRow id="dBranco">
            {/* Theme toggle */}
            <IonRow className="rowContainer">
              <div className="contConfig">
                <div className="cor" id="tema"></div>
                <p className="titConfig">Tema:</p>
              </div>
              <label className="switch">
                <input defaultChecked={true} id="checkbox" type="checkbox" />
                <span className="sliderr">
                  <div className="star star_1"></div>
                  <div className="star star_2"></div>
                  <div className="star star_3"></div>
                  <svg viewBox="0 0 16 16" className="cloud_1 cloud">
                    <path
                      transform="matrix(.77976 0 0 .78395-299.99-418.63)"
                      fill="#fff"
                      d="m391.84 540.91c-.421-.329-.949-.524-1.523-.524-1.351 0-2.451 1.084-2.485 2.435-1.395.526-2.388 1.88-2.388 3.466 0 1.874 1.385 3.423 3.182 3.667v.034h12.73v-.006c1.775-.104 3.182-1.584 3.182-3.395 0-1.747-1.309-3.186-2.994-3.379.007-.106.011-.214.011-.322 0-2.707-2.271-4.901-5.072-4.901-2.073 0-3.856 1.202-4.643 2.925"
                    />
                  </svg>
                </span>
              </label>
            </IonRow>
            
            {/* Sound toggle */}
            <IonRow className="rowContainer">
              <div className="contConfig">
                <div className="cor" id="som" />
                <p className="titConfig">Som:</p>
              </div>
              <div className="toggleWrapper">
                <input
                  type="checkbox"
                  id="checkboxInput"
                  checked={!somAtivo} 
                  onChange={(e) => toggleSom()}
                />
                <label htmlFor="checkboxInput" className="toggleSwitch">
                  <div className={`speaker ${somAtivo ? 'visivel' : 'oculto'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 75">
                      <path d="M39.389 13.769 22.235 28.606 6 28.606v19.093h15.989L39.389 62.75V13.769z"
                        style={{ stroke: '#fff', strokeWidth: 5, strokeLinejoin: 'round', fill: '#fff' }} />
                      <path d="M48 27.6a19.5 19.5 0 0 1 0 21.4M55.1 20.5a30 30 0 0 1 0 35.6M61.6 14a38.8 38.8 0 0 1 0 48.6"
                        style={{ fill: 'none', stroke: '#fff', strokeWidth: 5, strokeLinecap: 'round' }} />
                    </svg>
                  </div>
                  <div className={`mute-speaker ${somAtivo ? 'oculto' : 'visivel'}`}>
                    <svg viewBox="0 0 75 75" stroke="#fff" strokeWidth={5}>
                      <path d="M39 14 22 29H6v19h16l17 15z" fill="#fff" strokeLinejoin="round" />
                      <path d="M49 26 69 50M69 26 49 50" fill="#fff" strokeLinecap="round" />
                    </svg>
                  </div>
                </label>
              </div>
            </IonRow>
            
            {/* Language selection */}
            <IonRow className="rowContainer">
              <div className="contConfig">
                <div className="cor" id="idioma"></div>
                <p className="titConfig">Idioma:</p>
              </div>
              <div className="containerIdioma">
                <form>
                  <label>
                    <input type="radio" name="radio" defaultChecked />
                    <span>Português</span>
                  </label>
                  <label>
                    <input type="radio" name="radio" />
                    <span>Inglês</span>
                  </label>
                </form>
              </div>
            </IonRow>
            
            {/* Notifications toggle */}
            <IonRow className="rowContainer">
              <div className="contConfig">
                <div className="cor" id="notificacoes"></div>
                <p className="titConfig">Notificações:</p>
              </div>
              <label className="containerNotif">
                <input
                  type="checkbox"
                  checked={notificacoesAtivas}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setNotificacoesAtivas(checked);
                    localStorage.setItem('notificacoesAtivas', checked.toString());
                  }}
                />
                <svg
                  className={`bell-regular ${notificacoesAtivas ? 'oculto' : 'visivel'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
                </svg>
                <svg
                  className={`bell-solid ${notificacoesAtivas ? 'visivel' : 'oculto'}`}
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 448 512"
                >
                  <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                </svg>
              </label>
            </IonRow>
            
            {/* Reset settings */}
            <IonRow className="rowContainer">
              <div className="contConfig">
                <div className="cor" id="resetar"></div>
                <p className="titConfig">Resetar:</p>
              </div>
              <button className="bin-button" onClick={resetarConfiguracoes}>
                <svg className="bin-top" viewBox="0 0 39 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line y1={5} x2={39} y2={5} stroke="white" strokeWidth={4} />
                  <line x1={12} y1="1.5" x2="26.0357" y2="1.5" stroke="white" strokeWidth={3} />
                </svg>
                <svg className="bin-bottom" viewBox="0 0 33 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <mask id="path-1-inside-1_8_19" fill="white">
                    <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
                  </mask>
                  <path d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" fill="white" mask="url(#path-1-inside-1_8_19)" />
                  <path d="M12 6L12 29" stroke="white" strokeWidth={4} />
                  <path d="M21 6V29" stroke="white" strokeWidth={4} />
                </svg>
              </button>
            </IonRow>
          </IonRow>
        </IonRow>
      )}
      
      {/* Profile settings mobile */}
      {mobileView === 'perfil' && (
        <IonRow id="confPerfil">
          <h1>Configurações de estudo</h1>
          <IonRow>
            <IonRow className="paddingConf">
              <p className="labelBio">Nome</p>
              <IonInput name="name" value={userData.name} onIonChange={handleInputChange} className="inputBio" />
              <p className="labelBio">Sobrenome</p>
              <IonInput name="surname" value={userData.surname} onIonChange={handleInputChange} className="inputBio" />
              <p className="labelBio">Email</p>
              <IonInput type="email" name="email" value={userData.email} onIonChange={handleInputChange} className="inputBio" />
              <p className="labelBio">Biografia</p>
              <IonTextarea name="biography" value={userData.biography || ''} onIonChange={handleInputChange} className="inputBio" placeholder="Escreva sobre você..." />                                       
            </IonRow>
            <IonRow className="contBtn">
              <IonButton className="btnConfigBio" id="btnSalvarBio" onClick={handleSaveProfile}>Salvar</IonButton>
            </IonRow>                              
          </IonRow>
        </IonRow>
      )}
      
      {/* Security settings mobile */}
      {mobileView === 'seguranca' && (
        <IonRow id="confSeg">
          <h1>Configurações de segurança</h1>
          <IonRow className="paddingConf">
            <p className="labelBioM">Alterar senha</p>
            <IonInput
              className="inputBioSenhaM"
              label="Senha atual"
              labelPlacement="stacked"
              type="password"
              name="senha_atual"
              value={passwordData.senha_atual}
              onIonChange={handlePasswordInputChange}
            />

            <IonInput
              className="inputBioSenhaM"
              label="Nova senha"
              labelPlacement="stacked"
              type="password"
              name="nova_senha"
              value={passwordData.nova_senha}
              onIonChange={handlePasswordInputChange}
            />
            <IonInput
              className="inputBioSenhaM"
              label="Confirmar senha"
              labelPlacement="stacked"
              type="password"
              name="confirmar_senha"
              value={passwordData.confirmar_senha}
              onIonChange={handlePasswordInputChange}
            />

            <IonRow className="contBtn">
              <IonButton className="btnConfigBio" id="btnAlterarBio" onClick={handlePasswordChange}>
                Alterar
              </IonButton>
            </IonRow>

            <div id="excSenhaM">
              <IonRow className="msmLinha">
                <IonCheckbox checked={isChecked} onIonChange={handleCheckboxChange} id="check" />
                <p className="excpM" id="boldExcM">Deseja excluir sua conta?</p>
              </IonRow>
              <IonRow className="msmLinha">
                <IonIcon icon={warning} className="iconesBio" />
                <p className="excpM">ATENÇÃO: essa ação não pode ser desfeita.</p>
              </IonRow>
              <IonRow>
                <p className="excpM">Ao confirmar essa ação, sua conta será apagada permanentemente e não poderá ser recuperada.</p>
              </IonRow>
              <IonRow>
                <IonButton 
                  className="btnConfigBio" disabled={!isChecked} onClick={handleDeleteClick}>Confirmar</IonButton>
              </IonRow>
            </div>
          </IonRow>
        </IonRow>
      )}
      
      {/* Study settings mobile */}
      {mobileView === 'estudo' && (
        <IonRow id="confEstudo">
          <h1 className="txtCentro">Configurações avançadas de estudo</h1>
          <IonRow className="flexRow">
            <IonRow className="flexRow">
              <IonRow>
                <p className="pEstudo">Dias para o estudo semanal</p>
              </IonRow>
              <IonRow className="diasContainer">
                {diasSemana.map(dia => (
                <IonRow key={dia} className="msmLinha">
                  <IonCheckbox
                    checked={diasSelecionados.includes(dia)}
                    onIonChange={() => toggleDia(dia)}
                  />
                  <p className="pDiaMat">{dia}</p>
                </IonRow>
                ))}
              </IonRow>
              <IonRow className="diasContainer2">
                <IonRow>
                  {diasSemana.slice(0, 3).map(dia => (
                    <IonRow key={dia} className="msmLinha">
                      <IonCheckbox
                        checked={diasSelecionados.includes(dia)}
                        onIonChange={() => toggleDia(dia)}
                      />
                      <p className="pDiaMat">{dia}</p>
                    </IonRow>
                  ))}
                </IonRow>
                <IonRow>
                  {diasSemana.slice(3).map(dia => (
                    <IonRow key={dia} className="msmLinha">
                      <IonCheckbox
                        checked={diasSelecionados.includes(dia)}
                        onIonChange={() => toggleDia(dia)}
                      />
                      <p className="pDiaMat">{dia}</p>
                    </IonRow>
                  ))}
                </IonRow>
              </IonRow>
            </IonRow>
            <IonCol>
              {diasSelecionados.slice(0, 3).map(dia => (
                <IonRow key={dia}>
                  <p>Horário - {dia}</p>
                  <IonInput
                    placeholder="Ex: 14h - 16h"
                    value={horariosEstudo[dia] || ''}
                    onIonChange={e => handleHorarioChange(dia, e.detail.value!)}
                  />
                </IonRow>
              ))}
            </IonCol>
            <IonCol>
              {diasSelecionados.slice(3).map(dia => (
                <IonRow key={dia}>
                  <p>Horário - {dia}</p>
                  <IonInput
                    placeholder="Ex: 14h - 16h"
                    value={horariosEstudo[dia] || ''}
                    onIonChange={e => handleHorarioChange(dia, e.detail.value!)}
                  />
                </IonRow>
              ))}
            </IonCol>
            <IonRow className="flexRow">
              <IonButton className="btnAddDM">+ Adicionar dia</IonButton>
            </IonRow>

            <IonRow id="linhaHorizontal"></IonRow>

            <IonRow className="flexRow">
              <IonRow className="centro">
                <p className="pEstudo">Matérias para estudo semanal</p>
              </IonRow>
              <IonRow className="materiasContainer flexColumn">
                {materias.map((materia, index) => (
                  <IonRow key={index} className="msmLinha larguraMat">
                    <IonRow className="msmLinha larguraMat">
                      <p className="pDiaMat">{materia}</p>
                      <IonIcon
                        icon={chevronDown}
                        onClick={() => toggleMateriaAberta(materia)}
                        className="iconeChevron"
                      />
                    </IonRow>
                    {materiasAbertas[materia] && (
                      <IonRow className="diasMateria larguraDias">
                        <IonCol>
                          {diasSemana.slice(0, 3).map(dia => (
                            <IonRow key={dia} className="msmLinha">
                              <IonCheckbox
                                checked={diasSelecionados.includes(`${materia}-${dia}`)}
                                onIonChange={() => toggleDia(`${materia}-${dia}`)}
                              />
                              <p className="pDiaMat">{dia}</p>
                            </IonRow>
                          ))}
                        </IonCol>
                        <IonCol>
                          {diasSemana.slice(3).map(dia => (
                            <IonRow key={dia} className="msmLinha">
                              <IonCheckbox
                                checked={diasSelecionados.includes(`${materia}-${dia}`)}
                                onIonChange={() => toggleDia(`${materia}-${dia}`)}
                              />
                              <p className="pDiaMat">{dia}</p>
                            </IonRow>
                          ))}
                        </IonCol>
                      </IonRow>
                    )}
                  </IonRow>
                ))}
              </IonRow>
            </IonRow>
          </IonRow>
        </IonRow>
      )}
      
      {/* Logout button */}
      <IonRow className="containerConfigM">
        <IonButton className="btnConfiggM" type="button" onClick={(e) => {
          e.stopPropagation();
          logout();
        }}>
          <IonIcon icon={logOut} className="iconeSairM" />
          Sair
        </IonButton>
      </IonRow>
    </IonRow>
  );

  return (
    <IonPage>
      <Header />
      <IonContent fullscreen className="altura">
        <IonRow className="altura">
          {renderDesktopView()}
          {renderMobileView()}
        </IonRow>
        
        {/* Alerts */}
        <IonAlert
          isOpen={showAlert.show}
          onDidDismiss={() => setShowAlert({ show: false, message: '' })}
          header={'Aviso'}
          message={showAlert.message}
          buttons={['OK']}
        />
        <IonAlert
          isOpen={showDeleteConfirm}
          onDidDismiss={() => setShowDeleteConfirm(false)}
          header={'Atenção!'}
          message={'Você tem certeza que deseja excluir sua conta permanentemente? Para confirmar, digite "excluir" abaixo.'}
          inputs={[
            {
              name: 'confirmText', 
              type: 'text',
              placeholder: 'excluir'
            }
          ]}
          buttons={[
            {
              text: 'Cancelar',
              role: 'cancel', 
            },
            {
              text: 'Excluir Conta',
              cssClass: 'ion-color-danger',
              handler: (alertData) => {
                if (alertData.confirmText === 'excluir') {
                  executeAccountDeletion();
                } else {
                  setShowAlert({ show: true, message: 'Texto de confirmação inválido.' });
                }
              }
            }
          ]}
        />
      </IonContent>
    </IonPage>
  );
};

export default Perfil;