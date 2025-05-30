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

  const handleChange = (selectedOptions: MultiValue<DiaSemanaOption>) => {
    setDiasSelecionados(selectedOptions);
    console.log('Dias selecionados:', selectedOptions);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'left' }}>Selecione os dias da semana:</h2>
      <Select
        isMulti
        options={opcoesDias}
        value={diasSelecionados}
        onChange={handleChange}
        placeholder="Escolha os dias..."
        menuPortalTarget={document.body}
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
};

export default MultiSelectDias;
