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
       $this->middleware('auth');//erro 401
    }

    public function index()
    {
        $usuarioId = Auth::id(); 

        $configuracao = AgendaConfiguracao::with('diasDisponiveis.materia')
            ->where('usuario_id', $usuarioId)
            ->first();

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
            'dias_disponiveis.*.materia_id' => 'nullable|exists:materias,id',
        ]);

        // Validação extra para garantir hora_fim > hora_inicio
        foreach ($request->dias_disponiveis as $index => $dia) {
            if (strtotime($dia['hora_fim']) <= strtotime($dia['hora_inicio'])) {
                return response()->json([
                    'message' => "A hora fim deve ser maior que hora início para o dia {$dia['dia_semana']} (índice {$index})"
                ], 422);
            }
        }
        // Apagar antiga configuração do usuário (opcional)
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
                'materia_id' => $dia['materia_id'] ?? null,
            ]);
        }

        return response()->json(['message' => 'Configuração salva com sucesso.']);
    }
}
