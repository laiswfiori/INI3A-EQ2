<?php

namespace App\Http\Controllers;

use App\Services\AgendaHeuristicaService;
use App\Models\AgendaConfiguracao;
use App\Models\Materia;
use App\Models\Topico;
use App\Models\Atividade;
use App\Models\Flashcard;
use App\Models\CalendarioEstudos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class CalendarioEstudosController extends Controller
{
    protected $agendaService;

    public function __construct(AgendaHeuristicaService $agendaService)
    {
        $this->agendaService = $agendaService;
        $this->middleware('auth');
    }

    public function gerarAgenda()
    {
        $userId = Auth::id();
        $configuracaoId = AgendaConfiguracao::where('usuario_id', $userId)->first(); 
        
        try {
            $config = AgendaConfiguracao::with('diasDisponiveis')->find($configuracaoId->id);
            if (!$config) {
                return response()->json(['message' => 'Configuração não encontrada.'], 404);
            }

            $materiaIds = collect();
            foreach ($config->diasDisponiveis as $dia) {
                if (!empty($dia->materia_ids)) {
                    $ids = is_array($dia->materia_ids) ? $dia->materia_ids : json_decode($dia->materia_ids, true);
                    if (is_array($ids)) {
                        $materiaIds = $materiaIds->merge($ids);
                    }
                }
            }
            $materiaIds = $materiaIds->unique()->values();

            $materias = Materia::whereIn('id', $materiaIds)->get()->keyBy('id');
            $topicos = Topico::whereIn('materia_id', $materiaIds)->get()->groupBy('materia_id');

            $mapNivelParaNumero = [
                'muito fácil' => 1,
                'fácil' => 2,
                'médio' => 3,
                'difícil' => 4,
                'muito difícil' => 5,
            ];
            $mapNumeroParaNivel = [
                1 => 'muito fácil',
                2 => 'fácil',
                3 => 'médio',
                4 => 'difícil',
                5 => 'muito difícil',
            ];

            foreach ($materias as $materia) {
                $topicosMateria = $topicos[$materia->id] ?? collect();

                foreach ($topicosMateria as $topico) {
                    $atividades = Atividade::where('topico_id', $topico->id)->pluck('nivel');
                    $flashcards = Flashcard::where('topico_id', $topico->id)->pluck('nivel');

                    $todosNiveis = $atividades->merge($flashcards)->map(function ($nivel) use ($mapNivelParaNumero) {
                        return $mapNivelParaNumero[$nivel] ?? 3;
                    });

                    $media = $todosNiveis->avg();
                    $nivelAtribuido = round($media);

                    $topico->nivel = $mapNumeroParaNivel[$nivelAtribuido] ?? 'médio';
                    $topico->save();
                }

                $topicosAtualizados = Topico::where('materia_id', $materia->id)->pluck('nivel')->map(function ($nivel) use ($mapNivelParaNumero) {
                    return $mapNivelParaNumero[$nivel] ?? 3;
                });

                $nivelMedio = $topicosAtualizados->avg() ?: 3;

                if ($nivelMedio <= 2.5) {
                    $dificuldadeTexto = 'fácil';
                } elseif ($nivelMedio <= 3.5) {
                    $dificuldadeTexto = 'médio';
                } else {
                    $dificuldadeTexto = 'difícil';
                }

                $materia->dificuldade = $dificuldadeTexto;
                $materia->save();
            }

            foreach ($config->diasDisponiveis as $dia) {
                $dia->materias = collect();
                if (!empty($dia->materia_ids)) {
                    $ids = is_array($dia->materia_ids) ? $dia->materia_ids : json_decode($dia->materia_ids, true);
                    foreach ($ids as $id) {
                        if (isset($materias[$id])) {
                            $dia->materias->push($materias[$id]);
                        }
                    }
                }
            }

            $agenda = $this->agendaService->gerarAgenda($config);

            CalendarioEstudos::truncate();

            foreach ($agenda as $item) {
                Log::info('Revisoes item:', ['revisoes' => $item['revisoes'] ?? 'não existe']);

                $revisoesParaSalvar = json_encode([]);

                if (isset($item['revisoes'])) {
                    if ($item['revisoes'] instanceof \Illuminate\Support\Collection) {
                        $revisoesParaSalvar = json_encode($item['revisoes']->toArray());
                    } elseif (is_array($item['revisoes'])) {
                        if (isset($item['revisoes']['Illuminate\\Support\\Collection'])) {
                            $revisoesParaSalvar = json_encode($item['revisoes']['Illuminate\\Support\\Collection']);
                        } else {
                            $revisoesParaSalvar = json_encode($item['revisoes']);
                        }
                    } elseif (is_string($item['revisoes'])) {
                        $revisoesParaSalvar = $item['revisoes'];
                    }
                }
                
                Log::info('Valor final para revisoes:', ['valor' => $revisoesParaSalvar, 'tipo' => gettype($revisoesParaSalvar)]);

                CalendarioEstudos::create([
                    'usuario_id' => Auth::id(),
                    'materia_id' => $item['materia_id'],
                    'dia' => $item['dia'],
                    'hora_inicio' => $item['hora_inicio'],
                    'hora_fim' => $item['hora_fim'],
                    'revisoes' => $revisoesParaSalvar,
                ]);
            }


            return response()->json(['agenda' => $agenda]);

        } catch (\Throwable $e) {
            Log::error('Erro ao gerar agenda:', [
                'erro' => $e->getMessage(),
                'linha' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Erro interno ao gerar agenda.'], 500);
        }
    }
}