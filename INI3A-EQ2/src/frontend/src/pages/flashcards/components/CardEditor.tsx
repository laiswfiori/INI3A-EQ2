import React, { useEffect, useRef, useState } from 'react';
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
  conteudoFrenteInicial?: ConteudoItem[];
  conteudoVersoInicial?: ConteudoItem[];
}

const CardEditor: React.FC<CardEditorProps> = ({ onSave, onCancel, conteudoFrenteInicial = [], conteudoVersoInicial = [] }) => {
  const [textoFrente, setTextoFrente] = useState('');
  const [textoVerso, setTextoVerso] = useState('');
  const [imagensFrente, setImagensFrente] = useState<ConteudoItem[]>([]);
  const [imagensVerso, setImagensVerso] = useState<ConteudoItem[]>([]);

  const inputImagemFrenteRef = useRef<HTMLInputElement>(null);
  const inputImagemVersoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const textoFrenteItem = conteudoFrenteInicial.find(c => c.tipo === 'texto');
    const imagensFrenteItens = conteudoFrenteInicial.filter(c => c.tipo === 'imagem');
    setTextoFrente(textoFrenteItem?.valor || '');
    setImagensFrente(imagensFrenteItens);

    const textoVersoItem = conteudoVersoInicial.find(c => c.tipo === 'texto');
    const imagensVersoItens = conteudoVersoInicial.filter(c => c.tipo === 'imagem');
    setTextoVerso(textoVersoItem?.valor || '');
    setImagensVerso(imagensVersoItens);
  }, [conteudoFrenteInicial, conteudoVersoInicial]);

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


  const podeSalvar =
    (textoFrente.trim() !== '' || imagensFrente.length > 0) &&
    (textoVerso.trim() !== '' || imagensVerso.length > 0);

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
            className="inputImg"
            style={{ display: 'none' }}
          />
          <IonButton fill="clear" onClick={() => inputImagemVersoRef.current?.click()} className="image-button">
            <IonIcon icon={image} slot="icon-only" />
          </IonButton>
        </div>
      </div>

      <IonRow className="action-row">
        <IonButton color="medium" fill="outline" onClick={onCancel} className="action-button btnCancelarCard">
          Cancelar
        </IonButton>
        <IonButton
          onClick={() => {
            onSave(
              [{ tipo: 'texto', valor: textoFrente }, ...imagensFrente],
              [{ tipo: 'texto', valor: textoVerso }, ...imagensVerso]
            );
          }}
          disabled={!podeSalvar}
          className="action-button btnSalvarCard"
        >
          Salvar card
        </IonButton>
      </IonRow>
    </div>
  );
};

export default CardEditor;