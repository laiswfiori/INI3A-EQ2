// Validações para atividades
export function validarTituloAtividade(titulo: string): string | null {
  if (!titulo.trim()) {
    return 'O título da atividade é obrigatório.';
  }
  return null;
}

export function validarDescricaoAtividade(descricao: string): string | null {
  if (!descricao.trim()) {
    return 'A descrição da atividade é obrigatória.';
  }
  return null;
}

export function validarTipoAtividade(tipo: string): string | null {
  if (!tipo.trim()) {
    return 'O tipo da atividade é obrigatório.';
  }
  return null;
}

export function validarCamposAtividade(atividade: { titulo: string; tipo: string; descricao: string }): string | null {
  const erros = [
    validarTituloAtividade(atividade.titulo),
    validarDescricaoAtividade(atividade.descricao),
    validarTipoAtividade(atividade.tipo),
  ].filter(Boolean);

  if (erros.length > 0) return erros[0];
  return null;
}


// Validações para matérias
export function validarNomeMateria(nome: string): string | null {
  if (!nome.trim()) {
    return 'O nome da matéria é obrigatório.';
  }
  return null;
}


export function validarCamposMateria(materia: { nome: string }): string | null {
  const erros = [
    validarNomeMateria(materia.nome),
  ].filter(Boolean);

  if (erros.length > 0) return erros[0];
  return null;
}


// Validações para tópicos
export function validarTituloTopico(titulo: string): string | null {
  if (!titulo.trim()) {
    return 'O título do tópico é obrigatório.';
  }
  return null;
}

export function validarDescricaoTopico(descricao: string): string | null {
  if (!descricao.trim()) {
    return 'A descrição do tópico é obrigatória.';
  }
  return null;
}

export function validarCamposTopico(topico: { titulo: string; descricao: string }): string | null {
  const erros = [
    validarTituloTopico(topico.titulo),
    validarDescricaoTopico(topico.descricao),
  ].filter(Boolean);

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