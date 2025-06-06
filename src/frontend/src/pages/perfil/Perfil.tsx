import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonContent, IonCol, IonRow, IonIcon, IonButton, IonInput, IonCheckbox, IonTextarea, IonAlert, IonSpinner } from '@ionic/react';
import { caretForward, personCircle, warning, logOut, chevronDown } from 'ionicons/icons';
import { getUserProfile, updateUserProfile, changeUserPassword, deleteUserAccount } from '../../lib/endpoints';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import './css/switch.css';
import Header from '../../components/Header';
import API from '../../lib/api';

interface User {
    id: number;
    name: string;
    surname: string;
    email: string;
    password: string;
    biography: string;
}

const Perfil: React.FC = () => {
    const history = useHistory();

    const [isChecked, setIsChecked] = useState(false);
    const [view, setView] = useState<'perfil' | 'estudo'>('perfil');
    const [mobileView, setMobileView] = useState<'gerais' | 'perfil' | 'seguranca' | 'estudo'>('gerais');
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [userData, setUserData] = useState<User | null>(null);
    const [showAlert, setShowAlert] = useState<{show: boolean, message: string}>({show: false, message: ''});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [materias, setMaterias] = useState<string[]>(['Matéria 1', 'Matéria 2']);
    const [materiasAbertas, setMateriasAbertas] = useState<{ [key: string]: boolean }>({});
    const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
    const [horariosEstudo, setHorariosEstudo] = useState<{ [key: string]: string }>({});
    const [passwordData, setPasswordData] = useState({
        senha_atual: '',
        nova_senha: '',
        confirmar_senha: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [authError, setAuthError] = useState(false);


    const toggleMateriaAberta = (materia: string) => {
        setMateriasAbertas(prev => ({
            ...prev,
            [materia]: !prev[materia]
        }));
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


    const handleCheckboxChange = (e: CustomEvent) => {
        setIsChecked(e.detail.checked);
    };

    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

    const toggleDia = (diaCompleto: string) => {
        setDiasSelecionados(prev => {
            if (prev.includes(diaCompleto)) {
                return prev.filter(d => d !== diaCompleto);
            } else {
                return [...prev, diaCompleto];
            }
        });
    };

    const handleHorarioChange = (dia: string, valor: string) => {
        setHorariosEstudo(prev => ({ ...prev, [dia]: valor }));
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

   return (
       <IonPage>
           <Header />
           <IonContent fullscreen className="altura">
               <IonRow className="altura">
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
                                   <IonRow className="rowContainer">
                                       <div className="contConfig">
                                           <div className="cor" id="som"></div>
                                           <p className="titConfig">Som:</p>
                                       </div>
                                       <div className="toggleWrapper">
                                           <input type="checkbox" id="checkboxInput" />
                                           <label htmlFor="checkboxInput" className="toggleSwitch">
                                               <div className="speaker">
                                                   <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 75 75">
                                                       <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" style={{ stroke: '#fff', strokeWidth: 5, strokeLinejoin: 'round', fill: '#fff' }} />
                                                       <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" style={{ fill: 'none', stroke: '#fff', strokeWidth: 5, strokeLinecap: 'round' }} />
                                                   </svg>
                                               </div>
                                               <div className="mute-speaker">
                                                   <svg version="1.0" viewBox="0 0 75 75" stroke="#fff" strokeWidth={5}>
                                                       <path d="m39,14-17,15H6V48H22l17,15z" fill="#fff" strokeLinejoin="round" />
                                                       <path d="m49,26 20,24m0-24-20,24" fill="#fff" strokeLinecap="round" />
                                                   </svg>
                                               </div>
                                           </label>
                                       </div>
                                   </IonRow>
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
                                   <IonRow className="rowContainer">
                                       <div className="contConfig">
                                           <div className="cor" id="notificacoes"></div>
                                           <p className="titConfig">Notificações:</p>
                                       </div>
                                       <label className="containerNotif">
                                           <input type="checkbox" defaultChecked />
                                           <svg className="bell-regular" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                               <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
                                           </svg>
                                           <svg className="bell-solid" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                               <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                                           </svg>
                                       </label>
                                   </IonRow>
                                   <IonRow className="rowContainer">
                                       <div className="contConfig">
                                           <div className="cor" id="resetar"></div>
                                           <p className="titConfig">Resetar:</p>
                                       </div>
                                       <button className="bin-button">
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
                                   {/* ----- INÍCIO DA SEÇÃO DE SENHA ATUALIZADA (DESKTOP) ----- */}
                                    <IonCol className="colunasConfig" id="col2">
                                        <p className="labelBio">Alterar senha</p>

                                        {/* Input Senha Atual */}
                                        <IonInput
                                            className="inputBioSenha"
                                            label="Senha atual"
                                            labelPlacement="stacked"
                                            type="password"
                                            name="senha_atual"
                                            value={passwordData.senha_atual}
                                            onIonChange={handlePasswordInputChange}
                                        />

                                        {/* Input Nova Senha */}
                                        <IonInput
                                            className="inputBioSenha"
                                            label="Nova senha"
                                            labelPlacement="stacked"
                                            type="password"
                                            name="nova_senha"
                                            value={passwordData.nova_senha}
                                            onIonChange={handlePasswordInputChange}
                                        />

                                        {/* Input Confirmar Senha */}
                                        <IonInput
                                            className="inputBioSenha"
                                            label="Confirmar senha"
                                            labelPlacement="stacked"
                                            type="password"
                                            name="confirmar_senha"
                                            value={passwordData.confirmar_senha}
                                            onIonChange={handlePasswordInputChange}
                                        />

                                        {/* Botão Alterar com o onClick conectado */}
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
                                    {/* ----- FIM DA SEÇÃO DE SENHA ATUALIZADA (DESKTOP) ----- */}
                               </div>
                           </IonCol>
                       )}
                       {view === 'estudo' && (
                           <IonCol className="ladoEstudo">
                               <h1 className="preto" id="h1Titulo">Configurações avançadas de estudo</h1>
                               <div id="flexColunasEstudo">
                                   <IonCol id="colDias">
                                       <p className="pEstudo">Dias para o estudo semanal</p>
                                       <IonRow>
                                           <IonCol>
                                               {diasSemana.slice(0, 3).map(dia => (
                                                   <IonRow key={dia} className="msmLinha">
                                                       <IonCheckbox
                                                           checked={diasSelecionados.includes(dia)}
                                                           onIonChange={() => toggleDia(dia)}
                                                       />
                                                       <p className="pDiaMat">{dia}</p>
                                                   </IonRow>
                                               ))}
                                           </IonCol>
                                           <IonCol>
                                               {diasSemana.slice(3).map(dia => (
                                                   <IonRow key={dia} className="msmLinha">
                                                       <IonCheckbox
                                                           checked={diasSelecionados.includes(dia)}
                                                           onIonChange={() => toggleDia(dia)}
                                                       />
                                                       <p className="pDiaMat">{dia}</p>
                                                   </IonRow>
                                               ))}
                                           </IonCol>
                                       </IonRow>
                                       <IonRow>
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
                                       </IonRow>
                                       <IonRow>
                                           <IonButton className="btnAddDM">+ Adicionar dia</IonButton>
                                       </IonRow>
                                   </IonCol>
                                   <div id="linhaVertical">&nbsp;</div>
                                   <IonCol id="colMats">
                                        <p className="pEstudo">Matérias por dia</p>

                                        {materias.map((materia, index) => (
                                            <div key={index}>
                                                <IonRow className="msmLinha">
                                                    <p className="pDiaMat">{materia}</p>
                                                    <IonIcon
                                                        icon={chevronDown}
                                                        onClick={() => toggleMateriaAberta(materia)}
                                                        className="iconeChevron"
                                                    />
                                                </IonRow>

                                                {materiasAbertas[materia] && (
                                                    <IonRow className="diasMateria">
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
                                            </div>
                                        ))}
                                    </IonCol>
                               </div>
                           </IonCol>
                       )}
                   </IonRow>
                   {/*Mobile*/}
                   <IonRow id="lMobile" className="pagPerfilM">
                       <IonRow id="imgM">
                           <IonIcon icon={personCircle} id="iconePerfil" />
                           <div id="txtOi">
                               <p className="txtPading">Olá, {nomeUsuario}.</p>
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
                           <h1>Configurações gerais</h1>
                           <IonRow id="dBranco">
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
                               <IonRow className="rowContainer">
                                   <div className="contConfig">
                                       <div className="cor" id="som"></div>
                                       <p className="titConfig">Som:</p>
                                   </div>
                                   <div className="toggleWrapper">
                                       <input type="checkbox" id="checkboxInput" />
                                       <label htmlFor="checkboxInput" className="toggleSwitch">
                                           <div className="speaker">
                                               <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 75 75">
                                                   <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" style={{ stroke: '#fff', strokeWidth: 5, strokeLinejoin: 'round', fill: '#fff' }} />
                                                   <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" style={{ fill: 'none', stroke: '#fff', strokeWidth: 5, strokeLinecap: 'round' }} />
                                               </svg>
                                           </div>
                                           <div className="mute-speaker">
                                               <svg version="1.0" viewBox="0 0 75 75" stroke="#fff" strokeWidth={5}>
                                                   <path d="m39,14-17,15H6V48H22l17,15z" fill="#fff" strokeLinejoin="round" />
                                                   <path d="m49,26 20,24m0-24-20,24" fill="#fff" strokeLinecap="round" />
                                               </svg>
                                           </div>
                                       </label>
                                   </div>
                               </IonRow>
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
                               <IonRow className="rowContainer">
                                   <div className="contConfig">
                                       <div className="cor" id="notificacoes"></div>
                                       <p className="titConfig">Notificações:</p>
                                   </div>
                                   <label className="containerNotif">
                                       <input type="checkbox" defaultChecked />
                                       <svg className="bell-regular" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                           <path d="M224 0c-17.7 0-32 14.3-32 32V49.9C119.5 61.4 64 124.2 64 200v33.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V200c0-75.8-55.5-138.6-128-150.1V32c0-17.7-14.3-32-32-32zm0 96h8c57.4 0 104 46.6 104 104v33.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V200c0-57.4 46.6-104 104-104h8zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
                                       </svg>
                                       <svg className="bell-solid" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
                                           <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416H416c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" />
                                       </svg>
                                   </label>
                               </IonRow>
                               <IonRow className="rowContainer">
                                   <div className="contConfig">
                                       <div className="cor" id="resetar"></div>
                                       <p className="titConfig">Resetar:</p>
                                   </div>
                                   <button className="bin-button">
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
                       {/* ----- INÍCIO DA SEÇÃO DE SEGURANÇA ATUALIZADA (MOBILE) ----- */}
                        {mobileView === 'seguranca' && (
                            <IonRow id="confSeg">
                                <h1>Configurações de segurança</h1>
                                <IonRow className="paddingConf">
                                    <p className="labelBioM">Alterar senha</p>

                                    {/* Input Senha Atual */}
                                    <IonInput
                                        className="inputBioSenhaM"
                                        label="Senha atual"
                                        labelPlacement="stacked"
                                        type="password"
                                        name="senha_atual"
                                        value={passwordData.senha_atual}
                                        onIonChange={handlePasswordInputChange}
                                    />

                                    {/* Input Nova Senha */}
                                    <IonInput
                                        className="inputBioSenhaM"
                                        label="Nova senha"
                                        labelPlacement="stacked"
                                        type="password"
                                        name="nova_senha"
                                        value={passwordData.nova_senha}
                                        onIonChange={handlePasswordInputChange}
                                    />

                                    {/* Input Confirmar Senha */}
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
                                        {/* Botão Alterar com o onClick conectado */}
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
                        {/* ----- FIM DA SEÇÃO DE SEGURANÇA ATUALIZADA (MOBILE) ----- */}
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
               </IonRow>
               {/* Alerta global para feedback */}
                <IonAlert
                    isOpen={showAlert.show}
                    onDidDismiss={() => setShowAlert({ show: false, message: '' })}
                    header={'Aviso'}
                    message={showAlert.message}
                    buttons={['OK']}
                />

                {/* Este é o novo alerta para confirmar a exclusão da conta */}
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
