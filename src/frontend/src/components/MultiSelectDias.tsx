import React, { useEffect, useState } from 'react';
import Select, { MultiValue } from 'react-select';

export type Dia = 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';

type DiaSemanaOption = {
  value: Dia;
  label: string;
};

const opcoesDias: DiaSemanaOption[] = [
  { value: 'Segunda-feira', label: 'Segunda-feira' },
  { value: 'Terça-feira', label: 'Terça-feira' },
  { value: 'Quarta-feira', label: 'Quarta-feira' },
  { value: 'Quinta-feira', label: 'Quinta-feira' },
  { value: 'Sexta-feira', label: 'Sexta-feira' },
  { value: 'Sábado', label: 'Sábado' },
  { value: 'Domingo', label: 'Domingo' },
];

interface Props {
  onChange: (dias: Dia[]) => void;
  value: Dia[];
  onValidityChange?: (isValid: boolean) => void;
}

const MultiSelectDias: React.FC<Props> = ({ onChange, value, onValidityChange }) => {
  const [error, setError] = useState('');

  useEffect(() => {
    const isValid = value.length > 0;
    setError(isValid ? '' : 'Selecione pelo menos um dia da semana.');
    if (onValidityChange) onValidityChange(isValid);
  }, [value, onValidityChange]);

  const handleChange = (selectedOptions: MultiValue<DiaSemanaOption>) => {
    const diasSelecionados = selectedOptions.map(option => option.value) as Dia[];
    onChange(diasSelecionados);
  };

  const selectedOptions = opcoesDias.filter(option => value.includes(option.value));

  return (
    <div>
      <h2 className="txtAddPE"><b>Selecione os dias da semana:</b></h2>
      <Select
        isMulti
        options={opcoesDias}
        value={selectedOptions}
        onChange={handleChange}
        placeholder="Escolha os dias..."
        menuPortalTarget={document.body}
        classNamePrefix="react-select-custom"
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
      {error && <p style={{ color: '#b82020', paddingLeft: 4 }}>{error}</p>}
    </div>
  );
};

export default MultiSelectDias;
