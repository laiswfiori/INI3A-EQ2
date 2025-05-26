import React, { useState } from 'react';
import { IonPage, IonContent, IonCol, IonRow, IonIcon, IonButton, IonInput, IonCheckbox  } from '@ionic/react';
import { caretForward, personCircle, warning, logOut } from 'ionicons/icons';
import './css/geral.css';
import './css/ui.css';
import './css/layout.css';
import './css/switch.css';
import Header from '../../components/Header';

const Perfil: React.FC = () => {
    const [isChecked, setIsChecked] = useState(false);
    const [view, setView] = useState<'perfil' | 'estudo'>('perfil');

    const handleCheckboxChange = (e: CustomEvent) => {
        setIsChecked(e.detail.checked);
    };

    const diasSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

    const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
    const [horariosEstudo, setHorariosEstudo] = useState<{ [key: string]: string }>({});
    const [materias, setMaterias] = useState<string[]>(['Matéria 1', 'Matéria 2']);
    const [novaMateria, setNovaMateria] = useState('');

    const toggleDia = (dia: string) => {
        setDiasSelecionados(prev => {
          let novoArray: string[];
          if (prev.includes(dia)) {
            novoArray = prev.filter(d => d !== dia);
          } else {
            novoArray = [...prev, dia];
          }
          return Array.from(new Set(novoArray));
        });
      };
    
    const handleHorarioChange = (dia: string, valor: string) => {
        setHorariosEstudo(prev => ({ ...prev, [dia]: valor }));
    };

    return (
        <IonPage>
            <Header />
                <IonContent  className="altura">
                    <IonRow className="pagPerfil">
                        <IonCol className="ladoPerfil">
                            <IonRow id="img">
                                <IonIcon icon={personCircle} id="iconePerfil"/>
                                <div id="txtOi">
                                    <p>Olá, <span>nome</span>.</p>
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
                                            <div className="speaker"><svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 75 75">
                                                <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" style={{stroke: '#fff', strokeWidth: 5, strokeLinejoin: 'round', fill: '#fff'}} />
                                                <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" style={{fill: 'none', stroke: '#fff', strokeWidth: 5, strokeLinecap: 'round'}} />
                                                </svg></div>
                                            <div className="mute-speaker"><svg version="1.0" viewBox="0 0 75 75" stroke="#fff" strokeWidth={5}>
                                                <path d="m39,14-17,15H6V48H22l17,15z" fill="#fff" strokeLinejoin="round" />
                                                <path d="m49,26 20,24m0-24-20,24" fill="#fff" strokeLinecap="round" />
                                                </svg></div>
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
                                            <input type="checkbox" defaultChecked/>
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
                                            <p className="titConfig">Resetar preferências:</p>
                                        </div>
                                        <button className="buttonPref">
                                            <svg viewBox="0 0 448 512" className="iconX"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                                        </button>   
                                    </IonRow>
                                </IonRow>
                                <IonRow className="containerConfig">
                                    <IonButton className="btnConfigg" onClick={(e) => {
                                        e.stopPropagation(); 
                                        setView('perfil');
                                    }}>Configurações de perfil
                                        <IonIcon icon={caretForward} className="iconesSeta"/>
                                    </IonButton>
                                    
                                </IonRow>
                                <IonRow className="containerConfig">
                                <IonButton className="btnConfigg" type="button" onClick={(e) => {
                                        e.stopPropagation();
                                        setView('estudo');
                                        }}>Configurações avançadas de estudo
                                            <IonIcon icon={caretForward} className="iconesSeta" />
                                        </IonButton>
                                </IonRow>
                                <IonRow className="containerConfig">
                                    <IonButton className="btnConfigg" type="button" onClick={(e) => {
                                        e.stopPropagation();
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
                                    <h1 className="preto" id="h1Titulo">Confgurações de perfil</h1>
                                </div>
                                <div id="flexColunas">
                                <IonCol className="colunasConfig">
                                    <p className="labelBio">Nome</p>
                                    <IonInput
                                        labelPlacement="stacked"
                                        className="inputBio"
                                    />
                                    <p className="labelBio">Sobrenome</p>
                                    <IonInput
                                        labelPlacement="stacked"
                                        className="inputBio"
                                    />
                                    <p className="labelBio">Email</p>
                                    <IonInput
                                        labelPlacement="stacked"
                                        className="inputBio"
                                    />
                                    <p className="labelBio">Biografia</p>
                                    <IonInput
                                        labelPlacement="stacked"
                                        className="inputBio"
                                    />
                                    <IonButton className="btnConfigBio" id="btnSalvarBio">Salvar</IonButton>
                                </IonCol>
                                <IonCol className="colunasConfig" id="col2">
                                    <p className="labelBio">Alterar senha</p>
                                    <IonInput
                                        placeholder= "Senha atual"
                                        labelPlacement="stacked"
                                        className="inputBioSenha"
                                    />
                                    <IonInput
                                        placeholder= "Nova senha"
                                        labelPlacement="stacked"
                                        className="inputBioSenha"
                                    />
                                    <IonInput
                                        placeholder= "Cofirmar senha"
                                        labelPlacement="stacked"
                                        className="inputBioSenha"
                                    />
                                    <IonButton className="btnConfigBio" id="btnAlterarBio">Alterar</IonButton>
                                    <div id="excSenha">
                                        <IonRow className="msmLinha">
                                            <IonCheckbox checked={isChecked} onIonChange={handleCheckboxChange} id="check"/>
                                            <p className="excp" id="boldExc">Deseja excluir sua conta?</p>
                                        </IonRow>
                                        <IonRow className="msmLinha">
                                            <IonIcon icon={warning} className="iconesBio"/>
                                            <p className="excp">ATENÇÃO: essa ação não pode ser desfeita.</p>
                                        </IonRow>
                                        <IonRow>
                                            <p className="excp">Ao confirmar essa ação, sua conta será apagada permanentemente e não poderá ser recuperada.</p>
                                        </IonRow>
                                        <IonRow>
                                            <IonButton className="btnConfigBio">Confirmar</IonButton>
                                        </IonRow>
                                    </div>
                                </IonCol>
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
                                    <p className="pEstudo">Matérias cadastradas</p>
                                    {materias.map((materia, index) => (
                                    <IonRow key={index} className="msmLinha">
                                        <IonCheckbox checked={true} />
                                        <p className="pDiaMat">{materia}</p>
                                    </IonRow>
                                    ))}
                                    <IonRow>
                                    <IonButton className="btnAddDM">+ Adicionar</IonButton>
                                    </IonRow>
                                </IonCol>
                                </div>
                            </IonCol>
                            )}        
                    </IonRow>    
                </IonContent>
        </IonPage>
    );
};

export default Perfil;
