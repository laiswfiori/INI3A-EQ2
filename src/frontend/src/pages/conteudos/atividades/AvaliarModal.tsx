import React, { useState, useEffect } from 'react';
import { IonModal, IonButton, IonRow, IonInput, IonLabel } from '@ionic/react';

interface Atividade {
  id: number;
  titulo: string;
  tipo: string;
  status: string;
  nivel?: string | null;
  data_entrega?: string;
  exercicios?: number | null;
  acertos?: number | null;
  nota?: number | null;
  valor?: number | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  atividade: Atividade | null;
  onSalvar: (dados: any) => void;
}

const AvaliarModal: React.FC<Props> = ({ isOpen, onClose, atividade, onSalvar }) => {
  const [nivel, setNivel] = useState<string | null>(null);
  const [exercicios, setExercicios] = useState<number | null>(null);
  const [acertos, setAcertos] = useState<number | null>(null);
  const [nota, setNota] = useState<number | null>(null);
  const [valor, setValor] = useState<number | null>(null);

  useEffect(() => {
    if (atividade) {
      setNivel(atividade.nivel ?? null);
      setExercicios(atividade.exercicios ?? null);
      setAcertos(atividade.acertos ?? null);
      setNota(atividade.nota ?? null);
      setValor(atividade.valor ?? null);
    }
  }, [atividade]);

  if (!atividade) return null;

  const tiposNivel = ['resumo', 'mapa mental', 'anotações', 'tarefa'];
  const tiposLista = ['lista'];
  const tiposProva = ['prova', 'simulado'];

  const podeAvaliarNivel = tiposNivel.includes(atividade.tipo);
  const podeAvaliarLista = tiposLista.includes(atividade.tipo);
  const podeAvaliarProva = tiposProva.includes(atividade.tipo);

  const niveis = [
    { desc: 'muito fácil', emoji: '😄', cor: '#1e7e34' },
    { desc: 'fácil', emoji: '😊', cor: '#28a745' },
    { desc: 'médio', emoji: '😐', cor: '#ffc107' },
    { desc: 'difícil', emoji: '😟', cor: '#fd7e14' },
    { desc: 'muito difícil', emoji: '😣', cor: '#dc3545' }
  ];

  const handleSalvar = () => {
    if (podeAvaliarNivel) {
      if (!nivel) {
        alert('Selecione um nível');
        return;
      }
      onSalvar({ nivel });
    } else if (podeAvaliarLista) {
      if (exercicios === null || acertos === null || exercicios === 0) {
        alert('Preencha número de exercícios e acertos (mínimo 1 exercício)');
        return;
      }
      const percentual = (acertos / exercicios) * 100;
      let nivelCalculado: string;
      if (percentual >= 90) nivelCalculado = 'muito fácil';
      else if (percentual >= 75) nivelCalculado = 'fácil';
      else if (percentual >= 50) nivelCalculado = 'médio';
      else if (percentual >= 30) nivelCalculado = 'difícil';
      else nivelCalculado = 'muito difícil';
      setNivel(nivelCalculado);
      onSalvar({ exercicios, acertos, nivel: nivelCalculado });
    } else if (podeAvaliarProva) {
      if (nota === null || valor === null || valor === 0) {
        alert('Preencha nota e valor total (valor não pode ser zero)');
        return;
      }
      const percentual = (nota / valor) * 100;
      let nivelCalculado: string;
      if (percentual >= 90) nivelCalculado = 'muito fácil';
      else if (percentual >= 75) nivelCalculado = 'fácil';
      else if (percentual >= 50) nivelCalculado = 'médio';
      else if (percentual >= 30) nivelCalculado = 'difícil';
      else nivelCalculado = 'muito difícil';
      setNivel(nivelCalculado);
      onSalvar({ nota, valor, nivel: nivelCalculado });
    } else {
      alert('Tipo de atividade não suportado para avaliação');
    }
  };

  const handleClose = () => {
    setNivel(null);
    setExercicios(null);
    setAcertos(null);
    setNota(null);
    setValor(null);
    onClose();
  };

  return (
    <IonRow className="centro">
      <IonModal isOpen={isOpen} onDidDismiss={onClose} id="modalAvaliar">
        <div style={{ padding: 20 }}>
          <h2 className="pDarkmode">Avaliar atividade: {atividade.titulo}</h2>

          {podeAvaliarNivel && (
            <IonRow style={{ justifyContent: 'center', gap: '30px', marginTop: 20, flexWrap: 'wrap' }}>
              {niveis.map(({ desc, emoji, cor }) => (
                <div
                  key={desc}
                  onClick={() => setNivel(desc)}
                  style={{
                    backgroundColor: cor,
                    borderRadius: '50%',
                    width: '60px',
                    height: '60px',
                    fontSize: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transform: nivel === desc ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: nivel === desc ? '0 0 0 3px #333' : 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  title={desc}
                >
                  {emoji}
                </div>
              ))}
            </IonRow>
          )}

          {podeAvaliarLista && (
            <>
              <IonLabel className="pDarkmode">Número de exercícios</IonLabel>
              <IonInput
                type="number"
                value={exercicios ?? ''}
                onIonChange={e => setExercicios(Number(e.detail.value))}
                min={0}
              />
              <IonLabel className="pDarkmode">Número de acertos</IonLabel>
              <IonInput
                type="number"
                value={acertos ?? ''}
                onIonChange={e => setAcertos(Number(e.detail.value))}
                min={0}
                max={exercicios ?? undefined}
              />
            </>
          )}

          {podeAvaliarProva && (
            <>
              <IonLabel className="pDarkmode">Nota obtida</IonLabel>
              <IonInput
                type="number"
                value={nota ?? ''}
                onIonChange={e => setNota(Number(e.detail.value))}
                min={0}
              />
              <IonLabel className="pDarkmode">Valor total</IonLabel>
              <IonInput
                type="number"
                value={valor ?? ''}
                onIonChange={e => setValor(Number(e.detail.value))}
                min={0}
              />
            </>
          )}

          <IonRow className="rowAvaliarAtiv">
            <IonButton expand="block" onClick={handleSalvar} className="btnAvaliarAtiv btnSalvarAvaliacao">
              Salvar avaliação
            </IonButton>
            <IonButton expand="block" color="medium" onClick={handleClose} className="btnAvaliarAtiv btnCancelarAvaliacao">
              Cancelar
            </IonButton>
          </IonRow>
        </div>
      </IonModal>
    </IonRow>
  );
};

export default AvaliarModal;