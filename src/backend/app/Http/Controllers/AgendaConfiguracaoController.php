<?php

namespace App\Http\Controllers;

use App\Models\AgendaConfiguracao;
use App\Models\AgendaDiaDisponivel;
use Illuminate\Http\Request;

class AgendaConfiguracaoController extends Controller
{
    public function index(Request $request)
    {
        $usuarioId = $request->user()->id;

        $configuracao = AgendaConfiguracao::with('diasDisponiveis.materia')
            ->where('usuario_id', $usuarioId)
            ->first();

        return response()->json($configuracao);
    }

    public function store(Request $request)
    {
        $usuarioId = $request->user()->id;

        $this->validate($request, [
            'data_inicio' => 'required|date',
            'data_fim' => 'required|date|after_or_equal:data_inicio',
            'dias_disponiveis' => 'required|array|min:1',
            'dias_disponiveis.*.dia_semana' => 'required|in:segunda,terca,quarta,quinta,sexta,sabado,domingo',
            'dias_disponiveis.*.hora_inicio' => 'required|date_format:H:i',
            'dias_disponiveis.*.hora_fim' => 'required|date_format:H:i|after:dias_disponiveis.*.hora_inicio',
            'dias_disponiveis.*.materia_id' => 'nullable|exists:materias,id',
        ]);

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
