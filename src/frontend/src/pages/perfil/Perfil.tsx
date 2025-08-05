import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonCol, IonRow, IonIcon, IonButton,
  IonInput, IonCheckbox, IonTextarea, IonAlert, IonSpinner,
  IonItem, IonLabel, useIonRouter, IonSelect, IonSelectOption, IonText,
  IonImg
} from '@ionic/react';
import { caretForward, personCircle, warning, logOut, chevronDown, language, chevronUp } from 'ionicons/icons';
import { getUserProfile, updateUserProfile, changeUserPassword,
  deleteUserAccount, getAgendaConfiguracoes,
  saveAgendaConfiguracoes, getMaterias
} from '../../lib/endpoints';
import API from '../../lib/api';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import './css/switch.css';
import './css/darkmode.css';
import Header from '../../components/Header';
import ThemeManager from '../../utils/ThemeManager';
import '../../utils/css/variaveisCores.css';
import { useSoundPlayer } from '../../utils/Som';

interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  password?: string;
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
  materias: Materia[];
}

interface DiaAgendaPayload {
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  materias: number[];
}

interface AgendaConfigPayload {
  data_inicio: string;
  data_fim: string;
  dias_disponiveis: DiaAgendaPayload[];
}

const Perfil: React.FC = () => {
  const history = useHistory();
  const ionRouter = useIonRouter();
  const { somAtivo, toggleSom } = useSoundPlayer();

  const [isChecked, setIsChecked] = useState(false);
  const [view, setView] = useState<'perfil' | 'estudo'>('perfil');
  const [mobileView, setMobileView] = useState<'gerais' | 'perfil' | 'seguranca' | 'estudo'>('gerais');
  const [userData, setUserData] = useState<User | null>(null);
  const [showAlert, setShowAlert] = useState<{ show: boolean, message: string }>({ show: false, message: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState<boolean>(false);
  const [checked, setChecked] = useState(false);


  const [passwordData, setPasswordData] = useState({
    senha_atual: '',
    nova_senha: '',
    confirmar_senha: ''
  });

  const [periodoEstudo, setPeriodoEstudo] = useState({
    inicio: '',
    fim: ''
  });
  const [horariosDeEstudo, setHorariosDeEstudo] = useState<HorarioEstudo[]>([]);
  const [diasSemana] = useState(['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']);
  const [materiasDisponiveis, setMateriasDisponiveis] = useState<Materia[]>([]);
  const [novaMateriaNome, setNovaMateriaNome] = useState<string>('');

  const [notificacoesAtivas, setNotificacoesAtivas] = useState(() => localStorage.getItem('notificacoesAtivas') !== 'false');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') !== 'dark');

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    if (!newTheme) { 
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    setChecked(false);
  }, []);

  const navEstudar = () => {
    history.push('/estudo/estudo');  
  };

  const [mostrarGuia, setMostrarGuia] = useState(false);
  const toggleGuia = () => {
    setMostrarGuia(!mostrarGuia);
  };


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
    const normalizarDiaBackendParaFrontend = (dia: string): string => {
      const diaMap: { [key: string]: string } = {
        'segunda': 'Segunda-feira',
        'terca': 'Terça-feira',
        'quarta': 'Quarta-feira',
        'quinta': 'Quinta-feira',
        'sexta': 'Sexta-feira',
        'sabado': 'Sábado',
        'domingo': 'Domingo',
      };
      return diaMap[dia.toLowerCase()] || dia;
    };

    const carregarDadosEstudo = async () => {
      setLoadingConfig(true);
      try {
        const materiasRes = await getMaterias();
        setMateriasDisponiveis(materiasRes);

        const config = await getAgendaConfiguracoes();

        if (config && config.dias_disponiveis && config.dias_disponiveis.length > 0) {
          const dias: HorarioEstudo[] = config.dias_disponiveis.map((diaBackend: any) => {
            const materiaIds = Array.isArray(diaBackend.materia_ids) ? diaBackend.materia_ids : [];
            
            const materiasFormatadas: Materia[] = materiaIds.map((mId: number) => {
              const encontrada = materiasRes.find((m: Materia) => m.id === mId);
              return encontrada || { id: mId, nome: `ID ${mId}` };
            });

            return {
              dia_semana: normalizarDiaBackendParaFrontend(diaBackend.dia_semana),
              horario_inicio: diaBackend.hora_inicio,
              horario_fim: diaBackend.hora_fim,
              materias: materiasFormatadas,
            };
          });

          setHorariosDeEstudo(dias.sort((a, b) => diasSemana.indexOf(a.dia_semana) - diasSemana.indexOf(b.dia_semana)));
          setPeriodoEstudo({
            inicio: config.data_inicio || '',
            fim: config.data_fim || '',
          });
        } else {
          setHorariosDeEstudo([]);
          setPeriodoEstudo({ inicio: '', fim: '' });
        }
      } catch (error) {
        console.error("Erro ao carregar dados de estudo:", error);
        setShowAlert({ show: true, message: 'Erro ao carregar configurações de estudo. Tente novamente.' });
      } finally {
        setLoadingConfig(false);
      }
    };

    carregarDadosEstudo();
  }, []);

  const handleCheckboxChange = (e: CustomEvent) => {
    setIsChecked(e.detail.checked);
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

  const handleMateriaSelect = (dia: string, selectedMateriaIds: number[]) => {
    setHorariosDeEstudo(prev =>
      prev.map(h => {
        if (h.dia_semana === dia) {
          const novasMaterias = selectedMateriaIds
            .map(id => materiasDisponiveis.find((m: Materia) => m.id === id))
            .filter((m): m is Materia => m !== undefined);
          return { ...h, materias: novasMaterias };
        }
        return h;
      })
    );
  };

  const criarNovaMateria = async () => {
    if (!novaMateriaNome.trim()) {
      setShowAlert({ show: true, message: 'Digite um nome para a nova matéria.' });
      return;
    }
    setLoadingConfig(true);
    const api = new API();
    try {
      const response = await api.post('materias', { nome: novaMateriaNome.trim() });
      if (response && response.id && response.nome) {
        const novaMateria: Materia = { id: response.id, nome: response.nome };
        setMateriasDisponiveis(prev => [...prev, novaMateria]);
        setNovaMateriaNome('');
        setShowAlert({ show: true, message: `Matéria "${response.nome}" criada com sucesso!` });
      } else {
        throw new Error('Resposta inválida ao criar matéria.');
      }
    } catch (error: any) {
      console.error("Erro ao criar nova matéria:", error);
      let errorMessage = 'Erro ao criar a matéria.';
      if (error.message) {
        errorMessage = error.message;
      }
      setShowAlert({ show: true, message: errorMessage });
    } finally {
      setLoadingConfig(false);
    }
  };

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
    setLoadingConfig(true);

    if (horariosDeEstudo.some(h => !h.horario_inicio || !h.horario_fim)) {
      setShowAlert({ show: true, message: 'Preencha o horário de início e fim para todos os dias selecionados.' });
      setLoadingConfig(false);
      return;
    }

    if (!periodoEstudo.inicio || !periodoEstudo.fim) {
      setShowAlert({ show: true, message: 'Preencha o período total de estudo (data de início e fim).' });
      setLoadingConfig(false);
      return;
    }

    for (const dia of horariosDeEstudo) {
      const { horario_inicio: inicio, horario_fim: fim } = dia;
      if (inicio && fim && inicio >= fim) {
        setShowAlert({ show: true, message: `A hora de término deve ser posterior à de início para ${dia.dia_semana}.` });
        setLoadingConfig(false);
        return;
      }
    }

    const diasSemMateria = horariosDeEstudo.filter(h => h.materias.length === 0);
    if (diasSemMateria.length > 0) {
      const dias = diasSemMateria.map(d => d.dia_semana).join(', ');
      setShowAlert({ show: true, message: `Selecione pelo menos uma matéria para os dias: ${dias}.` });
      setLoadingConfig(false);
      return;
    }

    const normalizar = (dia: string): string =>
      dia.toLowerCase().replace('-feira', '').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const formatarHora = (hora: string): string => {
      if (!hora) return '';
      const [h, m] = hora.split(':');
      return `${h.padStart(2, '0')}:${m.padStart(2, '0')}`;
    };

    // agrupando matérias por (dia_semana + horário)
    const mapaDias = new Map<string, {
      dia_semana: string;
      hora_inicio: string;
      hora_fim: string;
      materia_ids: number[];
    }>();

    for (const h of horariosDeEstudo) {
      const dia = normalizar(h.dia_semana);
      const hora_inicio = formatarHora(h.horario_inicio);
      const hora_fim = formatarHora(h.horario_fim);
      const key = `${dia}-${hora_inicio}-${hora_fim}`;

      if (!mapaDias.has(key)) {
        mapaDias.set(key, {
          dia_semana: dia,
          hora_inicio,
          hora_fim,
          materia_ids: [],
        });
      }

      const grupo = mapaDias.get(key)!;
      for (const materia of h.materias) {
        if (!grupo.materia_ids.includes(materia.id)) {
          grupo.materia_ids.push(materia.id);
        }
      }
    }

    const dias_disponiveis = Array.from(mapaDias.values());

    const payload = {
      data_inicio: periodoEstudo.inicio,
      data_fim: periodoEstudo.fim,
      dias_disponiveis,
    };

    //console.log("Payload enviado:", JSON.stringify(payload, null, 2));

    try {
      await saveAgendaConfiguracoes(payload);
      setShowAlert({ show: true, message: 'Configurações salvas com sucesso!' });
    } catch (error: any) {
      console.error("Erro ao salvar configurações:", error);
      let msg = 'Erro ao salvar as configurações.';
      if (error.response?.data?.message) {
        msg = error.response.data.message;
        if (error.response.data.details) {
          msg += ` Detalhes: ${JSON.stringify(error.response.data.details)}`;
        }
      } else if (error.message) {
        msg = error.message;
      }
      setShowAlert({ show: true, message: msg });
    } finally {
      setLoadingConfig(false);
    }
  };

  const toggleNotificacoes = (checked: boolean) => {
    setNotificacoesAtivas(checked);
    localStorage.setItem('notificacoesAtivas', checked.toString());
  };

const resetarConfiguracoes = () => {
  // Exibindo os estados iniciais
  console.log("Estados Iniciais:");
  console.log("Som Ativo:", somAtivo);
  console.log("Notificações Ativas:", notificacoesAtivas);
  console.log("Tema (Dark Mode):", isDarkMode);

  /*// Resetando as configurações
  const somAtualizado = !somAtivo; // Alterna o som ao resetar
  setSomAtivo(somAtualizado); // Atualiza o estado
  localStorage.setItem('somAtivo', somAtualizado.toString());  // Atualizando o localStorage do som
*/
  // Notificações: Não altera o estado de notificações se não for necessário
  setNotificacoesAtivas(true); 
  localStorage.setItem('notificacoesAtivas', 'true');  // Atualizando notificações no localStorage

  // Tema: O tema não deve ser alterado, mantenha o estado atual
  const temaAtualizado = isDarkMode;  // Não altera o tema
  setIsDarkMode(temaAtualizado); 
  localStorage.setItem('theme', temaAtualizado ? 'dark' : 'light');  // Atualizando o localStorage do tema

  // Exibindo a mensagem de sucesso
  setShowAlert({ show: true, message: 'Configurações resetadas com sucesso!' });

  // Exibindo os estados finais após a atualização
  setTimeout(() => {
    console.log("Estados Finais:");
    console.log("Som Ativo:", somAtivo); 
    console.log("Notificações Ativas:", notificacoesAtivas);
    console.log("Tema (Dark Mode):", isDarkMode);
  }, 0);
};



  if (isLoading || authError) {
    return (
      <>
        <ThemeManager />
        <IonPage>
          <Header />
          <IonContent fullscreen className="ion-text-center ion-padding">
            <IonSpinner name="crescent" />
            <p>Carregando...</p>
          </IonContent>
        </IonPage>
      </>
    );
  }

  if (!userData) {
    return (
      <>
        <ThemeManager />
        <IonPage>
          <Header />
          <IonContent fullscreen className="ion-text-center ion-padding">
            <p>Não foi possível carregar os dados do perfil.</p>
            <p>Por favor, tente recarregar a página.</p>
          </IonContent>
        </IonPage>
      </>
    );
  }

  const renderEstudoSection = () => (
    <IonCol>
      <h1 id="h1Titulo" className="ion-text-center">Configurações avançadas de estudo</h1>

      {loadingConfig ? (
        <div className="ion-text-center ion-padding">
          <IonSpinner name="crescent" />
          <p>Carregando configurações de estudo...</p>
        </div>
      ) : (
        <>
          <p style={{ marginTop: '20px', fontWeight: 'bold' }}>Período total de estudo:</p>
          <IonRow>
            <IonCol>
              <IonInput
                label="Data de Início"
                labelPlacement="stacked"
                type="date"
                value={periodoEstudo.inicio}
                onIonChange={e => setPeriodoEstudo({ ...periodoEstudo, inicio: e.detail.value! })}
              />
            </IonCol>
            <IonCol>
              <IonInput
                label="Data de Término"
                labelPlacement="stacked"
                type="date"
                value={periodoEstudo.fim}
                onIonChange={e => setPeriodoEstudo({ ...periodoEstudo, fim: e.detail.value! })}
              />
            </IonCol>
          </IonRow>

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

          {horariosDeEstudo.map((horario, index) => (
            <div key={index} style={{ border: '1px solid var(--ion-color-medium-tint)', borderRadius: '8px', marginBottom: '16px', padding: '16px' }}>
              <h3 style={{ borderBottom: '1px solid var(--ion-color-light-shade)', paddingBottom: '8px', marginBottom: '16px' }}>{horario.dia_semana}</h3>

              <p style={{ fontWeight: 'bold' }}>2. Defina o horário:</p>
              <IonRow>
                <IonCol>
                  <IonInput label="Início" labelPlacement="stacked" type="time" value={horario.horario_inicio || ''} onIonChange={e => handleTimeChange(horario.dia_semana, 'inicio', e.detail.value || '')} />
                </IonCol>
                <IonCol>
                  <IonInput label="Fim" labelPlacement="stacked" type="time" value={horario.horario_fim || ''} onIonChange={e => handleTimeChange(horario.dia_semana, 'fim', e.detail.value || '')} />
                </IonCol>
              </IonRow>

              <p style={{ fontWeight: 'bold' }}>3. Selecione as matérias ou crie uma nova:</p>

              <IonItem className="ion-margin-bottom">
                <IonInput
                  label="Nova Matéria"
                  labelPlacement="stacked"
                  placeholder="Ex: Física Quântica"
                  value={novaMateriaNome}
                  onIonChange={e => setNovaMateriaNome(e.detail.value!)}
                  disabled={loadingConfig}
                />
                <IonButton onClick={criarNovaMateria} slot="end" disabled={loadingConfig || !novaMateriaNome.trim()}>
                  {loadingConfig ? 'Criando...' : 'Criar'}
                </IonButton>
              </IonItem>

              {materiasDisponiveis.length > 0 ? (
                <IonItem>
                  <IonLabel>Materias existentes</IonLabel>
                  <IonSelect
                    value={horario.materias.map(m => m.id)}
                    multiple={true}
                    placeholder="Selecione as matérias"
                    onIonChange={e => handleMateriaSelect(horario.dia_semana, e.detail.value)}
                    disabled={loadingConfig}
                  >
                    {materiasDisponiveis.map(materia => (
                      <IonSelectOption key={materia.id} value={materia.id}>
                        {materia.nome}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </IonItem>
              ) : (
                <IonText color="medium">Nenhuma matéria disponível. Crie uma acima!</IonText>
              )}
            </div>
          ))}

          {horariosDeEstudo.length > 0 && (
            <IonButton expand="full" onClick={handleSalvar} disabled={loadingConfig} style={{ marginTop: '16px' }}>
              Salvar Configurações de Estudo
            </IonButton>
          )}
        </>
      )}
    </IonCol>
  );

  const renderDesktopView = () => (
    <>
      <ThemeManager />
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
              <IonRow className="rowContainer">
                <div className="contConfig">
                  <div className="cor" id="tema"></div>
                  <p className="titConfig">Tema:</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={toggleTheme}
                  />
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

                <IonRow className="rowContainer">
                <div className="contConfig" onClick={toggleGuia} style={{ cursor: 'pointer' }}>
                  <div className="cor" id="idioma"></div>
                  <IonIcon icon={language} className="iconeIdioma" />
                  <p className="titConfig titIdioma">: como mudar o idioma?</p>
                  <IonIcon icon={mostrarGuia ? chevronUp : chevronDown} className="iconeSetaDown" />
                </div>

                {mostrarGuia && (
                  <div className="containerIdioma">
                    <li>
                      <span className="rowTraduzir semNegrito">Clique no ícone
                        <IonImg src="/imgs/traduzir.png" alt="ícone de tradução do google" className="traducaoGoogle"/></span>
                      Obs: ele pode estar no lado direito da barra de navegação ou no menu com ⋮
                    </li>
                    <li>Clique em <span className="negrito">⋮</span></li>
                    <li>Selecione <span className="negrito">Escolher outro idioma</span></li>
                    <li>
                      Selecione o idioma para o qual deseja traduzir dentre a lista de opções.
                      Obs: por padrão ele será <span className="negrito">português</span>
                    </li>
                    <li>Clique em <span className="negrito">Traduzir</span></li>
                  </div>
                )}
              </IonRow>

              <IonRow className="rowContainer">
                <div className="contConfig">
                  <div className="cor" id="estudo"></div>
                  <p className="titConfig">Estudo virtual:</p>
                </div>
                <div>
                  <input id="check2" type="checkbox" checked={checked}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      setChecked(isChecked);
                      if (isChecked) {
                        navEstudar();
                      }
                    }}/>
                  <label className="switch2" htmlFor="check2">
                    <svg viewBox="0 0 212.4992 84.4688" overflow="visible">
                      <path pathLength={360} fill="none" stroke="currentColor" d="M 42.2496,84.4688 C 18.913594,84.474104 -0.00530424,65.555206 0,42.2192 0.01148477,18.895066 18.925464,-0.00530377 42.2496,0 65.573736,-0.00530377 84.487715,18.895066 84.4992,42.2192 84.504504,65.555206 65.585606,84.474104 42.2496,84.4688 18.913594,84.474104 -0.00530424,65.555206 0,42.2192 0.01148477,18.895066 18.925463,-0.00188652 42.2496,0 c 64,0 64,84.4688 128,84.4688 23.32414,0.0019 42.23812,-18.895066 42.2496,-42.2192 C 212.5042,18.913594 193.58561,-0.005304 170.2496,0 146.91359,-0.005304 127.9947,18.913594 128,42.2496 c 0.0115,23.324134 18.92546,42.224504 42.2496,42.2192 23.32414,0.0053 42.23812,-18.895066 42.2496,-42.2192 C 212.5042,18.913594 193.58561,-0.005304 170.2496,0 c -64,0 -64,84.4688 -128,84.4688 z" />
                    </svg>
                  </label>
                </div>
              </IonRow>
            </IonRow>

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

        {view === 'estudo' && renderEstudoSection()}
      </IonRow>
    </>
  );

  const renderMobileView = () => (
    <>
      <ThemeManager />
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

        {mobileView === 'gerais' && (
          <IonRow id="confGerais">
            <h1 className="pDarkmode">Configurações gerais</h1>
            <IonRow id="dBranco">
              <IonRow className="rowContainer">
                <div className="contConfig">
                  <div className="cor" id="tema"></div>
                  <p className="titConfig">Tema:</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={toggleTheme}
                  />
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

                <IonRow className="rowContainer">
                <div className="contConfig contConfigIdioma" onClick={toggleGuia} style={{ cursor: 'pointer' }}>
                  <div className="cor" id="idioma"></div>
                  <IonIcon icon={language} className="iconeIdioma" />
                  <p className="titConfig titIdioma">: como mudar o idioma?</p>
                  <IonIcon icon={mostrarGuia ? chevronUp : chevronDown} className="iconeSetaDown" />
                </div>

                {mostrarGuia && (
                  <div className="containerIdioma">
                    <li>
                      <span className="rowTraduzir semNegrito">Clique no ícone
                        <IonImg src="/imgs/traduzir.png" alt="ícone de tradução do google" className="traducaoGoogle"/></span>
                      Obs: ele pode estar no lado direito da barra de navegação ou no menu com ⋮
                    </li>
                    <li>Clique em <span className="negrito">⋮</span></li>
                    <li>Selecione <span className="negrito">Escolher outro idioma</span></li>
                    <li>
                      Selecione o idioma para o qual deseja traduzir dentre a lista de opções.
                      Obs: por padrão ele será <span className="negrito">português</span>
                    </li>
                    <li>Clique em <span className="negrito">Traduzir</span></li>
                  </div>
                )}
              </IonRow>

              <IonRow className="rowContainer">
                <div className="contConfig">
                  <div className="cor" id="estudo"></div>
                  <p className="titConfig">Estudo virtual:</p>
                </div>
                <div>
                  <input id="check2" type="checkbox" onChange={navEstudar}/>
                  <label className="switch2" htmlFor="check2">
                    <svg viewBox="0 0 212.4992 84.4688" overflow="visible">
                      <path pathLength={360} fill="none" stroke="currentColor" d="M 42.2496,84.4688 C 18.913594,84.474104 -0.00530424,65.555206 0,42.2192 0.01148477,18.895066 18.925464,-0.00530377 42.2496,0 65.573736,-0.00530377 84.487715,18.895066 84.4992,42.2192 84.504504,65.555206 65.585606,84.474104 42.2496,84.4688 18.913594,84.474104 -0.00530424,65.555206 0,42.2192 0.01148477,18.895066 18.925463,-0.00188652 42.2496,0 c 64,0 64,84.4688 128,84.4688 23.32414,0.0019 42.23812,-18.895066 42.2496,-42.2192 C 212.5042,18.913594 193.58561,-0.005304 170.2496,0 146.91359,-0.005304 127.9947,18.913594 128,42.2496 c 0.0115,23.324134 18.92546,42.224504 42.2496,42.2192 23.32414,0.0053 42.23812,-18.895066 42.2496,-42.2192 C 212.5042,18.913594 193.58561,-0.005304 170.2496,0 c -64,0 -64,84.4688 -128,84.4688 z" />
                    </svg>
                  </label>
                </div>
              </IonRow>
            </IonRow>
          </IonRow>
        )}

        {mobileView === 'perfil' && (
          <IonRow id="confPerfil">
            <h1 className="pDarkmode">Configurações de perfil</h1>
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

        {mobileView === 'seguranca' && (
          <IonRow id="confSeg">
            <h1 className="pDarkmode">Configurações de segurança</h1>
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

        {mobileView === 'estudo' && (
          <IonRow id="confEstudo">
            {renderEstudoSection()}
          </IonRow>
        )}

        <IonRow className="containerConfigM">
          <IonButton className="btnConfiggM btnSairM" type="button" onClick={(e) => {
            e.stopPropagation();
            logout();
          }}>
            <IonIcon icon={logOut} className="iconeSairM" />
            Sair
          </IonButton>
        </IonRow>
      </IonRow>
    </>
  );

  return (
    <>
      <ThemeManager />
      <IonPage>
        <Header />
        <IonContent fullscreen className="altura">
          <IonRow className="altura">
            {renderDesktopView()}
            {renderMobileView()}
          </IonRow>

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
    </>
  );
};

export default Perfil;