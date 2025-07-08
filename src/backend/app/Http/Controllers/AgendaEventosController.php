<?php

namespace App\Http\Controllers;

use App\Models\AgendaEventos;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AgendaEventosController extends Controller
{
    
    //:: => operador de resolução de escopo; acessa o model (estático)
    public function __construct()
    {
       $this->middleware('auth');//erro 401
    }

   // Auth::user() // retorna o objeto do usuário logado
    //Auth::id() retorna o ID do usuário autenticado
    public function index()
    {
        $userId = Auth::id(); // ID do usuário logado

        // Filtra apenas as matérias daquele usuário
        $materias = AgendaEventos::where('usuario_id', $userId)->get();

        return response()->json($materias);
    }


    public function store(Request $request)
    {
        
        $dados = $request->only(['nome', 'data', 'materias', 'prioridade']);
        
        $materia = AgendaEventos::create([
            'nome'     => $dados['nome'],
            'usuario_id' =>  Auth::id(),
            'data' =>  $dados['data'],
            'materias' =>  $dados['materias'],
            'prioridade' =>  $dados['prioridade'],
        ]);

        return response()->json($materia, 201); // 201 = código https que significa created; criado c sucesso

        
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
