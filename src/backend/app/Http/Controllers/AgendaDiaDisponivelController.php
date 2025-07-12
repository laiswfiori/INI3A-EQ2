<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AgendaDiaDisponivel;

class AgendaDiaDisponivelController extends Controller
{
    public function update(Request $request, $id)
    {
        $dia = AgendaDiaDisponivel::findOrFail($id);

        $this->validate($request, [
            'hora_inicio' => 'required|date_format:H:i',
            'hora_fim' => 'required|date_format:H:i|after:hora_inicio',
            'materia_id' => 'nullable|exists:materias,id',
        ]);

        $dia->update($request->only('hora_inicio', 'hora_fim', 'materia_id'));

        return response()->json(['message' => 'Dia atualizado com sucesso.']);
    }

    public function destroy($id)
    {
        $dia = AgendaDiaDisponivel::findOrFail($id);
        $dia->delete();

        return response()->json(['message' => 'Dia removido com sucesso.']);
    }
}
