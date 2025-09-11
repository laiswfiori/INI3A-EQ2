type AtividadeSimples = {
  id: number | string;
  titulo: string;
};

// Validações para atividades
export function validarTituloAtividade( titulo: string, atividadesDoTopico: AtividadeSimples[], idAtividadeEditada: number | string | null = null ): string | null {
  const tituloTrimmed = titulo.trim();

  if (!tituloTrimmed) {
    return 'O título da atividade é obrigatório.';
  }

  const tituloUpperCase = tituloTrimmed.toUpperCase();

  const atividadeExistente = atividadesDoTopico.find(
    (atividade) => atividade.titulo.trim().toUpperCase() === tituloUpperCase
  );

  // Se uma atividade com o mesmo título já existe E não é a atividade que está sendo editada
  if (atividadeExistente && atividadeExistente.id !== idAtividadeEditada) {
    return 'Já existe uma atividade com este título neste tópico.';
  }

  return null;
}

export function validarTipoAtividade(tipo: string): string | null {
  if (!tipo.trim()) {
    return 'O tipo da atividade é obrigatório.';
  }
  return null;
}

export function validarDataEntrega(data_entrega: string | undefined): string | null {
  if (!data_entrega) return null; 

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); 

  const data = new Date(data_entrega);
  if (data < hoje) {
    return 'A data de entrega deve ser hoje ou uma data futura.';
  }

  return null;
}

export function validarCamposAtividade(
  // A assinatura da função agora inclui os parâmetros para a validação de duplicidade
  atividade: { titulo: string; tipo: string; descricao: string, data_entrega: string | undefined },
  atividadesDoTopico: AtividadeSimples[],
  idAtividadeEditada: number | string | null = null
): string | null {
  const erros = [
    // A chamada para validar o título agora passa os argumentos necessários
    validarTituloAtividade(atividade.titulo, atividadesDoTopico, idAtividadeEditada),
    validarTipoAtividade(atividade.tipo),
    validarDataEntrega(atividade.data_entrega),
  ].filter(Boolean); // Filtra os resultados nulos

  if (erros.length > 0) return erros[0];
  return null;
}

type MateriaSimples = {
  id: number | string;
  nome: string;
};

// Validações para matérias
export function validarNomeMateria(
  nome: string,
  materias: MateriaSimples[],
  idMateriaEditada: number | string | null = null
): string | null {
  const nomeTrimmed = nome.trim();

  if (!nomeTrimmed) {
    return 'O nome da matéria é obrigatório.';
  }

  if (/\s/.test(nomeTrimmed)) {
    return 'O nome da matéria não pode conter espaços.';
  }

  const nomeUpperCase = nomeTrimmed.toUpperCase();

  const materiaExistente = materias.find(
    (materia) => materia.nome.trim().toUpperCase() === nomeUpperCase
  );

  // Se uma matéria com o mesmo nome existe e não é a matéria que está sendo editada
  if (materiaExistente && materiaExistente.id !== idMateriaEditada) {
    return 'Matéria já existe.';
  }

  return null;
}


export function validarCamposMateria(
  materia: { nome: string },
  materias: MateriaSimples[],
  idMateriaEditada: number | string | null = null): string | null {
  const erros = [validarNomeMateria(materia.nome, materias, idMateriaEditada)].filter(Boolean); // Filtra valores nulos ou vazios
  if (erros.length > 0) {
    return erros[0];
  }
  return null;
}

type TopicoSimples = {
  id: number | string;
  titulo: string;
};

// Validações para tópicos
export function validarTituloTopico(
  titulo: string,
  topicosDaMateria: TopicoSimples[] = [],
  idTopicoEditado: number | string | null = null
): string | null {
  const tituloTrimmed = titulo.trim();

  if (!tituloTrimmed) {
    return 'O título do tópico é obrigatório.';
  }

  // Protege contra undefined
  if (!Array.isArray(topicosDaMateria)) return null;

  // Normaliza o título para a comparação: remove todos os espaços e converte para maiúsculo.
  const tituloNormalizado = tituloTrimmed.replace(/\s+/g, '').toUpperCase();

  const topicoExistente = topicosDaMateria.find((topico) => {
    const tituloExistenteNormalizado = topico.titulo
      .trim()
      .replace(/\s+/g, '')
      .toUpperCase();
    return tituloExistenteNormalizado === tituloNormalizado;
  });

  if (topicoExistente && topicoExistente.id !== idTopicoEditado) {
    return 'Este tópico já existe nesta matéria.';
  }

  return null;
}

export function validarCamposTopico(
  topico: { titulo: string; descricao: string },
  topicosDaMateria: TopicoSimples[],
  idTopicoEditado: number | string | null = null
): string | null {
  const erros = [
    validarTituloTopico(topico.titulo, topicosDaMateria, idTopicoEditado),
  ].filter(Boolean); // Filtra valores nulos

  if (erros.length > 0) return erros[0];
  return null;
}

// Validação para avaliação de atividade
export function validarNivel(nivel: string | null | undefined): string | null {
  if (!nivel) {
    return 'A selção de um nível é obrigatória.';
  }
  return null;
}

export function validarLista(exercicios: number | null | undefined, acertos: number | null | undefined): string | null {
  if (exercicios === null || acertos === null) {
    return 'É obrigatório preencher o número de exercícios e acertos.';
  }
  return null;
}

export function validarProva(nota: number | null | undefined, valor: number | null | undefined, nivel: string | null | undefined): string | null {
  if (nota === null || valor === null) {
    return 'A nota e valor total são obrigatórios.';
  }
  if (!nivel) {
    return 'A selção de um nível é obrigatória.';
  }
  return null;
}

export function validarCamposAtividadeAvaliacao(params: {
  podeAvaliarNivel: boolean;
  podeAvaliarLista: boolean;
  podeAvaliarProva: boolean;
  nivel?: string | null;
  exercicios?: number | null;
  acertos?: number | null;
  nota?: number | null;
  valor?: number | null;
}): string | null {
  const { podeAvaliarNivel, podeAvaliarLista, podeAvaliarProva, nivel, exercicios, acertos, nota, valor } = params;

  if (podeAvaliarNivel) {
    return validarNivel(nivel);
  }
  if (podeAvaliarLista) {
    return validarLista(exercicios ?? null, acertos ?? null);
  }
  if (podeAvaliarProva) {
    return validarProva(nota ?? null, valor ?? null, nivel);
  }
  return 'Tipo de atividade não suportado para avaliação.';
}