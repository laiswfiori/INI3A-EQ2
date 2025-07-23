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

        $dias = AgendaDiaDisponivel::whereHas('configuracao', function ($query) use ($userId) {
            $query->where('usuario_id', $userId);
        })->get();

        return response()->json($dias);
    }

    public function update(Request $request, $id)
    {
        $dia = AgendaDiaDisponivel::findOrFail($id);

        $this->validate($request, [
            'hora_inicio'   => 'required|date_format:H:i',
            'hora_fim'      => 'required|date_format:H:i|after:hora_inicio',
            'materia_ids'   => 'required|array|min:1',
            'materia_ids.*' => 'exists:materias,id',
        ]);

        $dia->update($request->only('hora_inicio', 'hora_fim', 'materia_ids'));

        return response()->json([
            'message' => 'Dia atualizado com sucesso.',
            'dados'   => $dia,
        ]);
    }

    public function destroy($id)
    {
        $dia = AgendaDiaDisponivel::findOrFail($id);
        $dia->delete();

        return response()->json(['message' => 'Dia removido com sucesso.']);
    }
}
