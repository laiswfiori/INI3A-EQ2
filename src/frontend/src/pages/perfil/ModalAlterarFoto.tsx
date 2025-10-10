import React from 'react';
import { IonIcon } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import './css/modal.css';

// --- Interface de Props Corrigida ---
interface ModalAlterarFotoProps {
  isOpen: boolean;
  onClose: () => void;
  onAlterarClick: () => void; // Prop para lidar com o CLIQUE no botão
  onRemover: () => void;
  fotoAtual: string;
}

const ModalAlterarFoto: React.FC<ModalAlterarFotoProps> = ({ 
  isOpen, 
  onClose, 
  onAlterarClick, // Nova prop sendo usada
  onRemover, 
  fotoAtual 
}) => {
  // O useRef e a função handleAlterarClick foram removidos daqui
  // A lógica agora está centralizada no Perfil.tsx

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <IonIcon icon={closeCircleOutline} onClick={onClose} className="modal-close-icon" />
        <h2>Gerenciar Foto</h2>
        <div className="modal-body">
          <img src={fotoAtual} alt="Foto de perfil" className="modal-profile-pic" />
          
          {/* O input de arquivo escondido foi removido deste componente */}

          {/* --- Botão Corrigido --- */}
          {/* Agora o onClick chama a função que recebemos via props do Perfil.tsx */}
          <button onClick={onAlterarClick} className="btn-alterar">Alterar Foto</button>
          <button onClick={onRemover} className="btn-remover">Remover Foto</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlterarFoto;