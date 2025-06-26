import React, { useState, useRef, useEffect } from 'react';
import { IonButton, IonIcon, IonRow, IonTextarea, IonLabel } from '@ionic/react';
import { image, close, add } from 'ionicons/icons';
import './css/ui.css'; // Crie este arquivo para os estilos

interface ConteudoItem {
  tipo: 'texto' | 'imagem' | 'arquivo';
  valor: string;
  nome?: string;
}

interface CardEditorProps {
  onSave: (frente: ConteudoItem[], verso: ConteudoItem[]) => void;
  onCancel: () => void;
}

const CardEditor: React.FC<CardEditorProps> = ({ onSave, onCancel }) => {
  const [conteudoFrente, setConteudoFrente] = useState<ConteudoItem[]>([]);
  const [conteudoVerso, setConteudoVerso] = useState<ConteudoItem[]>([]);
  const [textoTempFrente, setTextoTempFrente] = useState('');
  const [textoTempVerso, setTextoTempVerso] = useState('');
  const inputImagemFrenteRef = useRef<HTMLInputElement>(null);
  const inputImagemVersoRef = useRef<HTMLInputElement>(null);

  // Adiciona texto automaticamente quando o textarea perde foco
  const handleBlurFrente = () => {
    if (textoTempFrente.trim()) {
      setConteudoFrente([...conteudoFrente, { tipo: 'texto', valor: textoTempFrente.trim() }]);
      setTextoTempFrente('');
    }
  };

  const handleBlurVerso = () => {
    if (textoTempVerso.trim()) {
      setConteudoVerso([...conteudoVerso, { tipo: 'texto', valor: textoTempVerso.trim() }]);
      setTextoTempVerso('');
    }
  };

  // Adiciona imagem
  const adicionarImagem = (e: React.ChangeEvent<HTMLInputElement>, lado: 'frente' | 'verso') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const novoItem = { 
          tipo: 'imagem', 
          valor: reader.result as string,
          nome: file.name
        };
        
        if (lado === 'frente') {
          setConteudoFrente([...conteudoFrente, novoItem]);
        } else {
          setConteudoVerso([...conteudoVerso, novoItem]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove item
  const removerItem = (index: number, lado: 'frente' | 'verso') => {
    if (lado === 'frente') {
      setConteudoFrente(conteudoFrente.filter((_, i) => i !== index));
    } else {
      setConteudoVerso(conteudoVerso.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="card-editor-container">
      <div className="card-sides-container">
        {/* Lado Frente */}
        <div className="card-side">
          <IonLabel className="side-label">Frente (Pergunta)</IonLabel>
          
          {/* Área de conteúdo existente */}
          <div className="content-preview">
            {conteudoFrente.map((item, idx) => (
              <div key={`frente-${idx}`} className="content-item">
                {item.tipo === 'texto' && <p>{item.valor}</p>}
                {item.tipo === 'imagem' && (
                  <div className="image-preview">
                    <img src={item.valor} alt="Preview" />
                    <span>{item.nome}</span>
                  </div>
                )}
                <IonIcon 
                  icon={close} 
                  className="remove-icon" 
                  onClick={() => removerItem(idx, 'frente')}
                />
              </div>
            ))}
          </div>
          
          {/* Área de adição */}
          <div className="add-content-area">
            <IonTextarea
              placeholder="Digite o conteúdo da frente..."
              value={textoTempFrente}
              onIonChange={e => setTextoTempFrente(e.detail.value!)}
              onIonBlur={handleBlurFrente}
              rows={2}
              autoGrow
              className="content-textarea"
            />
            
            <div className="action-buttons">
              <input
                type="file"
                accept="image/*"
                ref={inputImagemFrenteRef}
                onChange={(e) => adicionarImagem(e, 'frente')}
                style={{ display: 'none' }}
              />
              <IonButton 
                fill="clear"
                onClick={() => inputImagemFrenteRef.current?.click()}
                className="image-button"
              >
                <IonIcon icon={image} slot="icon-only" />
              </IonButton>
            </div>
          </div>
        </div>

        {/* Lado Verso */}
        <div className="card-side">
          <IonLabel className="side-label">Verso (Resposta)</IonLabel>
          
          {/* Área de conteúdo existente */}
          <div className="content-preview">
            {conteudoVerso.map((item, idx) => (
              <div key={`verso-${idx}`} className="content-item">
                {item.tipo === 'texto' && <p>{item.valor}</p>}
                {item.tipo === 'imagem' && (
                  <div className="image-preview">
                    <img src={item.valor} alt="Preview" />
                    <span>{item.nome}</span>
                  </div>
                )}
                <IonIcon 
                  icon={close} 
                  className="remove-icon" 
                  onClick={() => removerItem(idx, 'verso')}
                />
              </div>
            ))}
          </div>
          
          {/* Área de adição */}
          <div className="add-content-area">
            <IonTextarea
              placeholder="Digite o conteúdo do verso..."
              value={textoTempVerso}
              onIonChange={e => setTextoTempVerso(e.detail.value!)}
              onIonBlur={handleBlurVerso}
              rows={2}
              autoGrow
              className="content-textarea"
            />
            
            <div className="action-buttons">
              <input
                type="file"
                accept="image/*"
                ref={inputImagemVersoRef}
                onChange={(e) => adicionarImagem(e, 'verso')}
                style={{ display: 'none' }}
              />
              <IonButton 
                fill="clear"
                onClick={() => inputImagemVersoRef.current?.click()}
                className="image-button"
              >
                <IonIcon icon={image} slot="icon-only" />
              </IonButton>
            </div>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <IonRow className="action-row">
        <IonButton 
          color="medium" 
          fill="outline" 
          onClick={onCancel}
          className="action-button"
        >
          Cancelar
        </IonButton>
        <IonButton 
          color="primary" 
          onClick={() => onSave(conteudoFrente, conteudoVerso)}
          className="action-button"
          disabled={!conteudoFrente.length && !conteudoVerso.length}
        >
          Salvar Card
        </IonButton>
      </IonRow>
    </div>
  );
};

export default CardEditor;