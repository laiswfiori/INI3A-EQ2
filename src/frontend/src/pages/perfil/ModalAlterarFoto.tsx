import React, { useRef } from 'react';
import { IonIcon } from '@ionic/react';
import { closeCircleOutline } from 'ionicons/icons';
import './css/modal.css';

interface ModalAlterarFotoProps {
  isOpen: boolean;
  onClose: () => void;
  onAlterar: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemover: () => void;
  fotoAtual: string;
}

const ModalAlterarFoto: React.FC<ModalAlterarFotoProps> = ({ isOpen, onClose, onAlterar, onRemover, fotoAtual }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) {
    return null;
  }

  const handleAlterarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <IonIcon icon={closeCircleOutline} onClick={onClose} className="modal-close-icon" />
        <h2>Gerenciar Foto</h2>
        <div className="modal-body">
          <img src={fotoAtual} alt="Foto de perfil" className="modal-profile-pic" />
          <input
            type="file"
            accept="image/*"
            onChange={onAlterar}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
          <button onClick={handleAlterarClick} className="btn-alterar">Alterar Foto</button>
          <button onClick={onRemover} className="btn-remover">Remover Foto</button>
        </div>
      </div>
    </div>
  );
};

export default ModalAlterarFoto;