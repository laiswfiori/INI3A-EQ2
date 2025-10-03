<?php

namespace App\Http\Controllers;

use App\Models\AgendaConfiguracao;
use App\Models\AgendaDiaDisponivel;
use App\Models\Materia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AgendaConfiguracaoController extends Controller
{
    public function __construct()
    {
       $this->middleware('auth');
    }
    
    public function index(Request $request)
    {
        $usuarioId = Auth::id();

        $configuracao = AgendaConfiguracao::with('diasDisponiveis')->where('usuario_id', $usuarioId)->first();
        
        // Incluir informações sobre matérias disponíveis
        $materiasDisponiveis = Materia::where('usuario_id', $usuarioId)->get(['id', 'nome', 'dificuldade']);

        return response()->json([
            'configuracao' => $configuracao,
            'materias_disponiveis' => $materiasDisponiveis
        ]);
    }

    public function store(Request $request)
    {
        $usuarioId = Auth::id();

        $this->validate($request, [
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after_or_equal:data_inicio',
            'dias_disponiveis' => 'required|array|min:1',
            'dias_disponiveis.*.dia_semana' => 'required|in:segunda,terca,quarta,quinta,sexta,sabado,domingo',
            'dias_disponiveis.*.hora_inicio' => 'required|date_format:H:i',
            'dias_disponiveis.*.hora_fim' => 'required|date_format:H:i',
            // Tornar materia_ids opcional
            'dias_disponiveis.*.materia_ids' => 'nullable|array',
            'dias_disponiveis.*.materia_ids.*' => 'exists:materias,id',
        ]);

        // Verificar se o usuário tem pelo menos uma matéria cadastrada
        $totalMaterias = Materia::where('usuario_id', $usuarioId)->count();
        if ($totalMaterias === 0) {
            return response()->json([
                'message' => 'Você precisa cadastrar pelo menos uma matéria antes de criar uma agenda.'
            ], 422);
        }

        // Validação de horários
        foreach ($request->dias_disponiveis as $index => $dia) {
            if (strtotime($dia['hora_fim']) <= strtotime($dia['hora_inicio'])) {
                return response()->json([
                    'message' => "A hora fim deve ser maior que hora início para o dia {$dia['dia_semana']} (índice {$index})"
                ], 422);
            }

            // Se especificar matérias, validar que pertencem ao usuário
            if (!empty($dia['materia_ids'])) {
                $materiasUsuario = Materia::where('usuario_id', $usuarioId)
                    ->whereIn('id', $dia['materia_ids'])
                    ->count();
                
                if ($materiasUsuario !== count($dia['materia_ids'])) {
                    return response()->json([
                        'message' => "Algumas matérias especificadas para {$dia['dia_semana']} não pertencem ao usuário."
                    ], 422);
                }
            }
        }

        // Verificar se há pelo menos um dia sem matérias específicas OU se todas as matérias do usuário estão cobertas
        $todasMateriasEspecificadas = collect();
        $diasSemMaterias = 0;
        
        foreach ($request->dias_disponiveis as $dia) {
            if (empty($dia['materia_ids'])) {
                $diasSemMaterias++;
            } else {
                $todasMateriasEspecificadas = $todasMateriasEspecificadas->merge($dia['materia_ids']);
            }
        }
        
        $materiasNaoEspecificadas = Materia::where('usuario_id', $usuarioId)
            ->whereNotIn('id', $todasMateriasEspecificadas->unique())
            ->count();
            
        if ($materiasNaoEspecificadas > 0 && $diasSemMaterias === 0) {
            return response()->json([
                'message' => "Você tem {$materiasNaoEspecificadas} matéria(s) sem horários específicos. Deixe pelo menos um dia sem matérias especificadas para distribuição automática, ou especifique todas as matérias."
            ], 422);
        }

        // Limpar configurações anteriores
        AgendaDiaDisponivel::whereHas('configuracao', function($q) use ($usuarioId) {
            $q->where('usuario_id', $usuarioId);
        })->delete();

        AgendaConfiguracao::where('usuario_id', $usuarioId)->delete();

        // Criar nova configuração
        $config = AgendaConfiguracao::create([
            'usuario_id' => $usuarioId,
            'data_inicio' => $request->data_inicio,
            'data_fim' => $request->data_fim,
        ]);

        foreach ($request->dias_disponiveis as $dia) {
            AgendaDiaDisponivel::create([
                'agenda_configuracao_id' => $config->id,
                'dia_semana' => $dia['dia_semana'],
                'hora_inicio' => $dia['hora_inicio'],
                'hora_fim' => $dia['hora_fim'],
                'materia_ids' => $dia['materia_ids'] ?? null, // Pode ser null agora
            ]);
        }

        return response()->json([
            'message' => 'Configuração salva com sucesso.',
            'info' => [
                'total_materias' => $totalMaterias,
                'materias_especificadas' => $todasMateriasEspecificadas->unique()->count(),
                'materias_automaticas' => $materiasNaoEspecificadas,
                'dias_disponiveis' => count($request->dias_disponiveis)
            ]
        ]);
    }

    public function destroy()
    {
        $userId = Auth::id();

        $config = AgendaConfiguracao::where('usuario_id', $userId)->first();

        if (!$config) {
            return response()->json(['message' => 'Configuração não encontrada.'], 404);
        }

        $config->delete();

        return response()->json(['message' => 'Configuração deletada com sucesso.'], 200);
    }

    // Novo método para sugerir distribuição automática
    public function sugerirDistribuicao()
    {
        $usuarioId = Auth::id();
        $materias = Materia::where('usuario_id', $usuarioId)->get();
        
        if ($materias->isEmpty()) {
            return response()->json(['message' => 'Nenhuma matéria encontrada.'], 404);
        }

        // Sugerir distribuição baseada na dificuldade
        $faceis = $materias->where('dificuldade', 'fácil')->pluck('nome');
        $medias = $materias->where('dificuldade', 'médio')->pluck('nome');
        $dificeis = $materias->where('dificuldade', 'difícil')->pluck('nome');

        return response()->json([
            'sugestao' => [
                'faceis' => $faceis,
                'medias' => $medias, 
                'dificeis' => $dificeis
            ],
            'dica' => 'Matérias difíceis devem ter mais tempo. Se não especificar matérias em um dia, elas serão distribuídas automaticamente.'
        ]);
    }
}