<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

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

        foreach ($config->diasDisponiveis as $dia) {
            if (empty($dia->materias)) continue;

            $inicio = Carbon::parse($dia->hora_inicio);
            $fim = Carbon::parse($dia->hora_fim);

            

            $duracaoTotal = $inicio->diffInMinutes($fim);

           
            $somaDificuldades = $dia->materias->sum('dificuldade_numerica_temp') ?: 1;
            

            foreach ($dia->materias as $materia) {
                $materia->dificuldade_numerica_temp = $dificuldadeMap[$materia->dificuldade] ?? 30;
            }

            // Evita divisão por zero
            if ($somaDificuldades <= 0) {
                Log::warning('Soma das dificuldades zero ou negativa no dia', ['dia' => $dia->dia_semana]);
                continue;
            }

            $somaDificuldades = $dia->materias->sum('dificuldade_numerica_temp');

            foreach ($dia->materias as $materia) {
                $materia->dificuldade_numerica_temp = $dificuldadeMap[$materia->dificuldade] ?? 30; 
                $proporcao = $materia->dificuldade_numerica_temp / $somaDificuldades;
                $duracaoMateria = intval($duracaoTotal * $proporcao);
                $horaFimMateria = $inicio->copy()->addMinutes($duracaoMateria);
                

                $agenda[] = [
                    'materia_id' => $materia->id,
                    'materia_nome' => $materia->nome,
                    'dia' => $dia->dia_semana,
                    'hora_inicio' => $inicio->format('H:i'),
                    'hora_fim' => $horaFimMateria->format('H:i'),
                    'revisoes' => $this->gerarRevisoes($config->data_fim, $materia->dificuldade)
                ];

                $inicio = $horaFimMateria;
            }
        }

        return $agenda;
    }

    private function gerarRevisoes(string $dataFinal, string $dificuldade): \Illuminate\Support\Collection
    {
        $hoje = Carbon::now();
        $fim = Carbon::parse($dataFinal);

        // Multiplicador do espaçamento por dificuldade
        $multiplicador = match ($dificuldade) {
            'fácil' => 2.0,
            'médio' => 1.5,
            'difícil' => 1.25,
            default => 1.5,
        };

        $revisoes = [];
        $dias = 0;
        $incremento = 1; // Intervalo inicial: 1 dia
        $maxIncremento = 30; // Limite máximo de salto entre revisões em dias

        while (true) {
            $dataRevisao = $hoje->copy()->addDays((int)round($dias));
            if ($dataRevisao->gt($fim)) {
                break;
            }
            $revisoes[] = $dataRevisao->format('Y-m-d');

            // Incrementa o próximo intervalo
            $incremento = min($incremento * $multiplicador, $maxIncremento);
            $dias += $incremento;
        }

        return collect($revisoes);
    }
}
