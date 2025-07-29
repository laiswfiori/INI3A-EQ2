<?php

namespace App\Services;

use Carbon\Carbon;

class AgendaHeuristicaService
{
    public function gerarAgenda($config)
    {
        $agenda = [];

        foreach ($config->diasDisponiveis as $dia) {
            if (empty($dia->materias)) continue;

            $inicio = Carbon::parse($dia->hora_inicio);
            $fim = Carbon::parse($dia->hora_fim);
            $duracaoTotal = $inicio->diffInMinutes($fim);

            $somaDificuldades = $dia->materias->sum('dificuldade_numerica_temp') ?: 1;

            foreach ($dia->materias as $materia) {
                $proporcao = $materia->dificuldade_numerica_temp / $somaDificuldades;
                $duracaoMateria = intval($duracaoTotal * $proporcao);
                $horaFimMateria = $inicio->copy()->addMinutes($duracaoMateria);

                $agenda[] = [
                    'materia_id' => $materia->id,
                    'materia_nome' => $materia->nome,
                    'dia' => $dia->dia_semana,
                    'inicio' => $inicio->format('H:i'),
                    'fim' => $horaFimMateria->format('H:i'),
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
