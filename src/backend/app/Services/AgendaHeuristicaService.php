<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use App\Models\Materia;

class AgendaHeuristicaService
{
    public function gerarAgenda($config)
    {
        $agenda = [];
        $dificuldadeMap = [
            'fácil' => 1,
            'médio' => 2,
            'difícil' => 3,
        ];

        // 1. Buscar TODAS as matérias do usuário
        $todasMaterias = Materia::where('usuario_id', Auth::id())->get();
        
        // 2. Separar matérias específicas dos dias vs matérias livres
        $materiasEspecificas = collect();
        $materiasLivres = collect();
        $diasComEspacoLivre = collect();

        foreach ($config->diasDisponiveis as $dia) {
            if (!empty($dia->materia_ids)) {
                // Dia tem matérias específicas
                $ids = is_array($dia->materia_ids) ? $dia->materia_ids : json_decode($dia->materia_ids, true);
                $materiasEspecificasDia = $todasMaterias->whereIn('id', $ids);
                
                foreach ($materiasEspecificasDia as $materia) {
                    $materia->dificuldade_numerica_temp = $dificuldadeMap[$materia->dificuldade] ?? 2;
                }
                
                $dia->materias = $materiasEspecificasDia;
                $materiasEspecificas = $materiasEspecificas->merge($materiasEspecificasDia->pluck('id'));
                
            } else {
                // Dia sem matérias específicas - disponível para distribuição automática
                $dia->materias = collect();
                $diasComEspacoLivre->push($dia);
            }
        }

        // 3. Identificar matérias que NÃO foram especificamente alocadas
        $materiasLivres = $todasMaterias->whereNotIn('id', $materiasEspecificas->unique());
        
        // 4. Distribuir matérias livres nos dias disponíveis
        if ($materiasLivres->count() > 0 && $diasComEspacoLivre->count() > 0) {
            $this->distribuirMateriasLivres($materiasLivres, $diasComEspacoLivre, $dificuldadeMap);
        }

        // 5. Gerar agenda para todos os dias
        foreach ($config->diasDisponiveis as $dia) {
            if ($dia->materias->isEmpty()) continue;

            $inicio = Carbon::parse($dia->hora_inicio);
            $fim = Carbon::parse($dia->hora_fim);
            $duracaoTotal = $inicio->diffInMinutes($fim);

            // Calcular proporções baseadas na dificuldade
            $somaDificuldades = $dia->materias->sum('dificuldade_numerica_temp') ?: 1;

            foreach ($dia->materias as $materia) {
                $proporcao = $materia->dificuldade_numerica_temp / $somaDificuldades;
                $duracaoMateria = intval($duracaoTotal * $proporcao);
                $horaFimMateria = $inicio->copy()->addMinutes($duracaoMateria);

                $agenda[] = [
                    'materia_id' => $materia->id,
                    'materia_nome' => $materia->nome,
                    'dia' => $dia->dia_semana,
                    'hora_inicio' => $inicio->format('H:i'),
                    'hora_fim' => $horaFimMateria->format('H:i'),
                    'revisoes' => $this->gerarRevisoes(
                        $config->data_fim,
                        $materia->dificuldade,
                        $dia->dia_semana
                    ),
                    'tipo_alocacao' => in_array($materia->id, $materiasEspecificas->toArray()) ? 'específica' : 'automática'
                ];

                $inicio = $horaFimMateria;
            }
        }

        return $agenda;
    }

    private function distribuirMateriasLivres($materiasLivres, $diasDisponiveis, $dificuldadeMap)
    {
        // Preparar matérias livres com peso de dificuldade
        foreach ($materiasLivres as $materia) {
            $materia->dificuldade_numerica_temp = $dificuldadeMap[$materia->dificuldade] ?? 2;
        }

        // Algoritmo de distribuição: Round Robin ponderado por dificuldade
        $totalDificuldadeLivre = $materiasLivres->sum('dificuldade_numerica_temp');
        $diasCount = $diasDisponiveis->count();
        
        // Calcular capacidade de cada dia (baseado no tempo disponível)
        $capacidadeDias = [];
        $tempoTotalDisponivel = 0;
        
        foreach ($diasDisponiveis as $index => $dia) {
            $inicio = Carbon::parse($dia->hora_inicio);
            $fim = Carbon::parse($dia->hora_fim);
            $duracaoMinutos = $inicio->diffInMinutes($fim);
            $capacidadeDias[$index] = $duracaoMinutos;
            $tempoTotalDisponivel += $duracaoMinutos;
        }

        // Distribuir matérias proporcionalmente
        foreach ($diasDisponiveis as $indexDia => $dia) {
            $proporcaoDia = $capacidadeDias[$indexDia] / $tempoTotalDisponivel;
            $dificuldadeAlvo = $totalDificuldadeLivre * $proporcaoDia;
            
            $dificuldadeAcumulada = 0;
            $materiasDoDia = collect();
            
            // Selecionar matérias para este dia até atingir a proporção alvo
            foreach ($materiasLivres as $materia) {
                if ($dificuldadeAcumulada < $dificuldadeAlvo) {
                    $materiasDoDia->push($materia);
                    $dificuldadeAcumulada += $materia->dificuldade_numerica_temp;
                }
            }
            
            $dia->materias = $materiasDoDia;
            
            // Remover matérias já alocadas da lista de livres
            $materiasLivres = $materiasLivres->whereNotIn('id', $materiasDoDia->pluck('id'));
        }
        
        // Se ainda sobraram matérias, distribui no último dia
        if ($materiasLivres->count() > 0 && $diasDisponiveis->count() > 0) {
            $ultimoDia = $diasDisponiveis->last();
            $ultimoDia->materias = $ultimoDia->materias->merge($materiasLivres);
        }
    }

    private function gerarRevisoes(string $dataFinal, string $dificuldade, string $diaSemanaDisponivel): \Illuminate\Support\Collection
    {
        $hoje = Carbon::now();
        $fim = Carbon::parse($dataFinal);

        $multiplicador = match ($dificuldade) {
            'fácil' => 2.0,
            'médio' => 1.5,
            'difícil' => 1.25,
            default => 1.5,
        };

        $mapDiasSemana = [
            'domingo' => Carbon::SUNDAY,
            'segunda' => Carbon::MONDAY,
            'terca' => Carbon::TUESDAY,
            'quarta' => Carbon::WEDNESDAY,
            'quinta' => Carbon::THURSDAY,
            'sexta' => Carbon::FRIDAY,
            'sabado' => Carbon::SATURDAY,
        ];
        $numeroDiaDisponivel = $mapDiasSemana[strtolower($diaSemanaDisponivel)] ?? Carbon::MONDAY;

        $revisoes = [];
        $dias = 0;
        $incremento = 1;
        $maxIncremento = 30;

        while (true) {
            $dataRevisao = $hoje->copy()->addDays((int)round($dias));

            // Se a data calculada não é o dia desejado, ajusta para o próximo dia da semana correto
            if ($dataRevisao->dayOfWeek !== $numeroDiaDisponivel) {
                $diasParaAdicionar = ($numeroDiaDisponivel - $dataRevisao->dayOfWeek + 7) % 7;
                if ($diasParaAdicionar === 0) {
                    $diasParaAdicionar = 7;
                }
                $dataRevisao->addDays($diasParaAdicionar);
            }

            if ($dataRevisao->gt($fim)) {
                break;
            }

            $revisoes[] = $dataRevisao->format('Y-m-d');

            $incremento = min($incremento * $multiplicador, $maxIncremento);
            $dias += $incremento;
        }

        return collect(array_values(array_unique($revisoes)));
    }
}