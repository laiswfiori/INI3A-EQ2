import React, { useState } from 'react';
import Select, { MultiValue } from 'react-select';

type DiaSemanaOption = {
    value: string;
    label: string;
  };

const opcoesDias = [
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca', label: 'Terça-feira' },
  { value: 'quarta', label: 'Quarta-feira' },
  { value: 'quinta', label: 'Quinta-feira' },
  { value: 'sexta', label: 'Sexta-feira' },
  { value: 'sabado', label: 'Sábado' },
  { value: 'domingo', label: 'Domingo' },
];

const MultiSelectDias: React.FC = () => {
  const [diasSelecionados, setDiasSelecionados] = useState<MultiValue<DiaSemanaOption>>([]);

  const handleChange = (selectedOptions:  MultiValue<DiaSemanaOption>) => {
    setDiasSelecionados(selectedOptions);
    console.log('Dias selecionados:', selectedOptions);
  };

  return (
    <div style={{ padding: '16px' }}>
      <label style={{ marginBottom: '8px', display: 'block' }}>Selecione os dias da semana:</label>
      <Select
        isMulti 
        options={opcoesDias}
        value={diasSelecionados}
        onChange={handleChange}
        placeholder="Escolha os dias..."
      />
    </div>
  );
};

export default MultiSelectDias;
