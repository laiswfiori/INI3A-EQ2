<?php

namespace App\Http\Controllers;

use App\Models\AgendaEventos;
use App\Models\Materia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AgendaEventosController extends Controller
{
    
    public function __construct()
    {
       $this->middleware('auth');//erro 401
    }

    public function index()
    {
        $userId = Auth::id(); 

        // Pega apenas a coluna 'materias' dos eventos do usuário
        $materias = AgendaEventos::where('usuario_id', $userId)->pluck('materias');

        return response()->json($materias);

    }

    public function store(Request $request)
    {
        $dados = $request->only(['nome', 'data', 'materias', 'prioridade']);
        $userId = Auth::id();

        $evento = AgendaEventos::create([
            'nome'       => $dados['nome'],
            'usuario_id' => $userId,
            'data'       => $dados['data'],
            'materias'   => $dados['materias'],
            'prioridade' => $dados['prioridade'],
        ]);

        // Se materias for string, converte em array
        $listaMaterias = is_array($dados['materias'])
            ? $dados['materias']
            : array_map('trim', explode(',', $dados['materias']));

        return response()->json($evento, 201);
    }



    public function show($id)
    {
        $evento = AgendaEventos::where('id', $id)->where('usuario_id', Auth::id())->first();

        if (!$evento) {
            return response()->json(['message' => 'Evento não encontrado'], 404);
        }

        return response()->json($evento);
    }


    public function update(Request $request, $id)
    {
        $evento = AgendaEventos::where('id', $id)->where('usuario_id', Auth::id())->first();

        if (!$evento) {
            return response()->json(['message' => 'Matéria não encontrada'], 404);
        }

        $dados = $request->only(['nome', 'data', 'materias', 'prioridade']);
        $evento->fill($dados);
        $evento->save();

        return response()->json($evento);
    }


    public function destroy($id)
    {
        $evento = AgendaEventos::where('id', $id)->where('usuario_id', Auth::id())->first();

        if (!$evento) {
            return response()->json(['message' => 'Evento não encontrado'], 404);
        }

        $evento->delete();
        return response()->json(['message' => 'Evento deletado com sucesso.'], 200);
    }
}
