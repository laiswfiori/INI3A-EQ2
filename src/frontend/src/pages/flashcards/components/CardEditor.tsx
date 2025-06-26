import React, { useRef } from 'react';
import { IonButton, IonIcon, IonRow, IonTextarea, IonLabel } from '@ionic/react';
import { image, close } from 'ionicons/icons';
import './css/ui.css';

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
  const [textoFrente, setTextoFrente] = React.useState('');
  const [textoVerso, setTextoVerso] = React.useState('');
  const [imagensFrente, setImagensFrente] = React.useState<ConteudoItem[]>([]);
  const [imagensVerso, setImagensVerso] = React.useState<ConteudoItem[]>([]);

  const inputImagemFrenteRef = useRef<HTMLInputElement>(null);
  const inputImagemVersoRef = useRef<HTMLInputElement>(null);

  const handleAddImagem = (e: React.ChangeEvent<HTMLInputElement>, lado: 'frente' | 'verso') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const novoItem: ConteudoItem = {
          tipo: 'imagem',
          valor: reader.result as string,
          nome: file.name,
        };
        if (lado === 'frente') setImagensFrente(prev => [...prev, novoItem]);
        else setImagensVerso(prev => [...prev, novoItem]);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleRemoveImagem = (index: number, lado: 'frente' | 'verso') => {
    if (lado === 'frente') setImagensFrente(prev => prev.filter((_, i) => i !== index));
    else setImagensVerso(prev => prev.filter((_, i) => i !== index));
  };

  const podeSalvar = textoFrente.trim() !== '' && textoVerso.trim() !== '';

  return (
    <div className="card-editor-container">
      <div className="card-sides-container">

        <div className="card-side">
          <IonLabel className="side-label">Frente (Pergunta)</IonLabel>

          <IonTextarea
            placeholder="Digite o conteúdo da frente..."
            value={textoFrente}
            onIonChange={e => setTextoFrente(e.detail.value!)}
            rows={4}
            autoGrow
            className="content-textarea"
          />

          <div className="content-preview">
            {imagensFrente.map((item, idx) => (
              <div key={idx} className="content-item">
                <img src={item.valor} alt={item.nome} className="image-preview" />
                <IonIcon icon={close} className="remove-icon" onClick={() => handleRemoveImagem(idx, 'frente')} />
              </div>
            ))}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={inputImagemFrenteRef}
            onChange={e => handleAddImagem(e, 'frente')}
            style={{ display: 'none' }}
          />
          <IonButton fill="clear" onClick={() => inputImagemFrenteRef.current?.click()} className="image-button">
            <IonIcon icon={image} slot="icon-only" />
          </IonButton>
        </div>

        <div className="card-side">
          <IonLabel className="side-label">Verso (Resposta)</IonLabel>

          <IonTextarea
            placeholder="Digite o conteúdo do verso..."
            value={textoVerso}
            onIonChange={e => setTextoVerso(e.detail.value!)}
            rows={4}
            autoGrow
            className="content-textarea"
          />

          <div className="content-preview">
            {imagensVerso.map((item, idx) => (
              <div key={idx} className="content-item">
                <img src={item.valor} alt={item.nome} className="image-preview" />
                <IonIcon icon={close} className="remove-icon" onClick={() => handleRemoveImagem(idx, 'verso')} />
              </div>
            ))}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={inputImagemVersoRef}
            onChange={e => handleAddImagem(e, 'verso')}
            style={{ display: 'none' }}
          />
          <IonButton fill="clear" onClick={() => inputImagemVersoRef.current?.click()} className="image-button">
            <IonIcon icon={image} slot="icon-only" />
          </IonButton>
        </div>

      </div>

      <IonRow className="action-row">
        <IonButton color="medium" fill="outline" onClick={onCancel} className="action-button">
          Cancelar
        </IonButton>
        <IonButton color="primary" onClick={() => {
          onSave(
            [{ tipo: 'texto', valor: textoFrente }, ...imagensFrente],
            [{ tipo: 'texto', valor: textoVerso }, ...imagensVerso]
          );
        }} disabled={!podeSalvar} className="action-button">
          Salvar Card
        </IonButton>
      </IonRow>
    </div>
  );
};

export default CardEditor;
