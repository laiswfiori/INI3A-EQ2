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

            foreach ($dia->materias as $materia) {
                $materia->dificuldade_numerica_temp = $dificuldadeMap[$materia->dificuldade] ?? 30;
            }

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
                    )
                ];

                $inicio = $horaFimMateria;
            }
        }

        return $agenda;
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

            // Se a data calculada não é o dia desejado, ajusta para o próximo dia da semana correto (sempre pra frente)
            if ($dataRevisao->dayOfWeek !== $numeroDiaDisponivel) {
                $diasParaAdicionar = ($numeroDiaDisponivel - $dataRevisao->dayOfWeek + 7) % 7;
                if ($diasParaAdicionar === 0) {
                    $diasParaAdicionar = 7; // garante que vá para a próxima semana
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
