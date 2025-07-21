<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AgendaDiaDisponivel;
use Illuminate\Support\Facades\Auth;

class AgendaDiaDisponivelController extends Controller
{
    public function index()
    {
        $userId = Auth::id(); 

        // todos os dias disponíveis relacionados a este usuário pelo agenda_configuracao_id 
        $dias = AgendaDiaDisponivel::whereHas('configuracao', function ($query) use ($userId) {
            $query->where('usuario_id', $userId);
        })->with('materia')->get();

        return response()->json($dias);
    }


    public function update(Request $request, $id)
    {
        $dia = AgendaDiaDisponivel::findOrFail($id);

        $this->validate($request, [
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fim'    => 'required|date_format:H:i|after:hora_inicio',
            'materia_id'  => 'nullable|exists:materias,id',
        ]);

        // campos que podem ser atualizados
        $dadosAtualizados = $request->only('hora_inicio', 'hora_fim', 'materia_id');

        // p evitar atualização desnecessária se os dados n mudaram
        if (
            $dia->hora_inicio === $dadosAtualizados['hora_inicio'] &&
            $dia->hora_fim === $dadosAtualizados['hora_fim'] &&
            $dia->materia_id == $dadosAtualizados['materia_id']
        ) {
            return response()->json(['message' => 'Nenhuma alteração detectada.'], 200);
        }

        $dia->update($dadosAtualizados);

        return response()->json([
            'message' => 'Dia atualizado com sucesso.',
            'dados'   => $dia
        ]);
    }


    public function destroy($id)
    {
        $dia = AgendaDiaDisponivel::findOrFail($id);
        $dia->delete();

        return response()->json(['message' => 'Dia removido com sucesso.']);
    }
}
