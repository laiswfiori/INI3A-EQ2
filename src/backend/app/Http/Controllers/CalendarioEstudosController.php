<?php

namespace App\Http\Controllers;

use App\Services\AgendaHeuristicaService;
use App\Services\NivelCalculoService;
use App\Models\AgendaConfiguracao;
use App\Models\Materia;
use App\Models\CalendarioEstudos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class CalendarioEstudosController extends Controller
{
    protected $agendaService;
    protected $nivelService;

    public function __construct(AgendaHeuristicaService $agendaService, NivelCalculoService $nivelService)
    {
        $this->agendaService = $agendaService;
        $this->nivelService = $nivelService;
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

            // Recalcular níveis antes de gerar a agenda (garantia)
            $this->nivelService->recalcularTodosOsNiveis();

            $materias = Materia::whereIn('id', $materiaIds)->get()->keyBy('id');

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

    // Método adicional para recalcular níveis manualmente se necessário
    public function recalcularNiveis()
    {
        try {
            $this->nivelService->recalcularTodosOsNiveis();
            return response()->json(['message' => 'Níveis recalculados com sucesso.']);
        } catch (\Throwable $e) {
            Log::error('Erro ao recalcular níveis:', ['erro' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao recalcular níveis.'], 500);
        }
    }
}