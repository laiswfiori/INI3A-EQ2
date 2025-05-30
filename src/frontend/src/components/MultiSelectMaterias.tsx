import React, { useState } from 'react';
import Select, { MultiValue } from 'react-select';

type MateriaOption = {
  value: string;
  label: string;
};

const opcoesMaterias: MateriaOption[] = [
  { value: 'matematica', label: 'Matemática' },
  { value: 'portugues', label: 'Português' },
  { value: 'linguas', label: 'Línguas' },
  { value: 'fisica', label: 'Física' },
  { value: 'quimica', label: 'Química' },
  { value: 'historia', label: 'História' },
  { value: 'geografia', label: 'Geografia' },
  { value: 'filosofia', label: 'Filosofia' },
  { value: 'sociologia', label: 'Sociologia' }
];

const MultiSelectMaterias: React.FC = () => {
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<MultiValue<MateriaOption>>([]);

  const handleChange = (selectedOptions: MultiValue<MateriaOption>) => {
    setMateriasSelecionadas(selectedOptions);
    console.log('Matérias selecionadas:', selectedOptions);
  };

  return (
    <div style={{ padding: '16px' }}>
      <label style={{ marginBottom: '8px', display: 'block' }}>Selecione as matérias:</label>
      <Select<MateriaOption, true>
        isMulti
        options={opcoesMaterias}
        value={materiasSelecionadas}
        onChange={handleChange}
        placeholder="Escolha as matérias..."
      />
    </div>
  );
};

export default MultiSelectMaterias;
