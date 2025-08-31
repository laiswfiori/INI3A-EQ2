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
        $configuracao = AgendaConfiguracao::where('usuario_id', $userId)->first(); 
        
        try {
            $config = AgendaConfiguracao::with('diasDisponiveis')->find($configuracao->id);
            if (!$config) {
                return response()->json(['message' => 'Configuração não encontrada.'], 404);
            }

            // Verificar se o usuário tem matérias cadastradas
            $totalMaterias = Materia::where('usuario_id', $userId)->count();
            if ($totalMaterias === 0) {
                return response()->json(['message' => 'Nenhuma matéria encontrada. Cadastre pelo menos uma matéria antes de gerar a agenda.'], 400);
            }

            // Recalcular níveis antes de gerar a agenda
            $this->nivelService->recalcularTodosOsNiveis();

            // Gerar agenda (agora considerando todas as matérias)
            $agenda = $this->agendaService->gerarAgenda($config);

            // Limpar agenda anterior
            CalendarioEstudos::where('usuario_id', $userId)->delete();

            // Salvar nova agenda
            foreach ($agenda as $item) {
                Log::info('Salvando item da agenda:', [
                    'materia' => $item['materia_nome'] ?? 'N/A',
                    'tipo' => $item['tipo_alocacao'] ?? 'N/A',
                    'dia' => $item['dia'],
                    'revisoes' => $item['revisoes'] ?? 'não existe'
                ]);

                $revisoesParaSalvar = json_encode([]);

                if (isset($item['revisoes'])) {
                    if ($item['revisoes'] instanceof \Illuminate\Support\Collection) {
                        $revisoesParaSalvar = json_encode($item['revisoes']->toArray());
                    } elseif (is_array($item['revisoes'])) {
                        $revisoesParaSalvar = json_encode($item['revisoes']);
                    } elseif (is_string($item['revisoes'])) {
                        $revisoesParaSalvar = $item['revisoes'];
                    }
                }

                CalendarioEstudos::create([
                    'usuario_id' => $userId,
                    'materia_id' => $item['materia_id'],
                    'dia' => $item['dia'],
                    'hora_inicio' => $item['hora_inicio'],
                    'hora_fim' => $item['hora_fim'],
                    'revisoes' => $revisoesParaSalvar,
                    'tipo_alocacao' => $item['tipo_alocacao'] ?? 'automática', // Novo campo
                ]);
            }

            // Retornar informações estatísticas
            $materiasEspecificas = collect($agenda)->where('tipo_alocacao', 'específica')->count();
            $materiasAutomaticas = collect($agenda)->where('tipo_alocacao', 'automática')->count();

            return response()->json([
                'agenda' => $agenda,
                'estatisticas' => [
                    'total_materias' => $totalMaterias,
                    'materias_especificas' => $materiasEspecificas,
                    'materias_automaticas' => $materiasAutomaticas,
                    'total_sessions' => count($agenda)
                ]
            ]);

        } catch (\Throwable $e) {
            Log::error('Erro ao gerar agenda:', [
                'erro' => $e->getMessage(),
                'linha' => $e->getLine(),
                'arquivo' => $e->getFile(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['message' => 'Erro interno ao gerar agenda: ' . $e->getMessage()], 500);
        }
    }

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

    // Novo método para visualizar como as matérias serão distribuídas antes de gerar
    public function visualizarDistribuicao()
    {
        $userId = Auth::id();
        $configuracao = AgendaConfiguracao::where('usuario_id', $userId)->first();
        
        if (!$configuracao) {
            return response()->json(['message' => 'Configuração não encontrada.'], 404);
        }

        try {
            $config = AgendaConfiguracao::with('diasDisponiveis')->find($configuracao->id);
            $todasMaterias = Materia::where('usuario_id', $userId)->get();
            
            $distribuicao = [];
            $materiasEspecificas = collect();

            foreach ($config->diasDisponiveis as $dia) {
                $diaInfo = [
                    'dia_semana' => $dia->dia_semana,
                    'horario' => $dia->hora_inicio . ' - ' . $dia->hora_fim,
                    'materias_especificas' => [],
                    'materias_automaticas' => []
                ];

                if (!empty($dia->materia_ids)) {
                    $ids = is_array($dia->materia_ids) ? $dia->materia_ids : json_decode($dia->materia_ids, true);
                    $materiasEspecificasDia = $todasMaterias->whereIn('id', $ids);
                    $diaInfo['materias_especificas'] = $materiasEspecificasDia->pluck('nome')->toArray();
                    $materiasEspecificas = $materiasEspecificas->merge($ids);
                }

                $distribuicao[] = $diaInfo;
            }

            $materiasLivres = $todasMaterias->whereNotIn('id', $materiasEspecificas->unique())->pluck('nome')->toArray();

            return response()->json([
                'distribuicao' => $distribuicao,
                'materias_livres' => $materiasLivres,
                'total_materias' => $todasMaterias->count()
            ]);

        } catch (\Throwable $e) {
            return response()->json(['message' => 'Erro ao visualizar distribuição.'], 500);
        }
    }
}