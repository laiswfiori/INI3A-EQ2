<?php

namespace App\Http\Controllers;

use App\Models\AgendaConfiguracao;
use App\Models\AgendaDiaDisponivel;
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

        return response()->json($configuracao);
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
            'dias_disponiveis.*.materia_ids' => 'required|array|min:1',
            'dias_disponiveis.*.materia_ids.*' => 'exists:materias,id',
        ]);

        foreach ($request->dias_disponiveis as $index => $dia) {
            if (strtotime($dia['hora_fim']) <= strtotime($dia['hora_inicio'])) {
                return response()->json([
                    'message' => "A hora fim deve ser maior que hora início para o dia {$dia['dia_semana']} (índice {$index})"
                ], 422);
            }
        }

        AgendaDiaDisponivel::whereHas('configuracao', function($q) use ($usuarioId) {
            $q->where('usuario_id', $usuarioId);
        })->delete();

        AgendaConfiguracao::where('usuario_id', $usuarioId)->delete();

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
                'materia_ids' => $dia['materia_ids'],
            ]);
        }

        return response()->json(['message' => 'Configuração salva com sucesso.']);
    }
}
