import React from 'react';
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
}

const MultiSelectDias: React.FC<Props> = ({ onChange, value }) => {
  const handleChange = (selectedOptions: MultiValue<DiaSemanaOption>) => {
    // Cast explícito para Dia[]
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
        styles={{
          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
        }}
      />
    </div>
  );
};

export default MultiSelectDias;
