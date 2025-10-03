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

const PerfilMobile: React.FC = () => {
    return (
      <>
        <ThemeManager />
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
  </>
  );
};

export default PerfilMobile;