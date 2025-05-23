<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class MateriasController extends Controller
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
        $user = auth()->user(); // pega o usuário autenticado
        $userId = $user->id;
        
        $materias = Materia::where('usuario_id', $userId)->get();
        return response()->json($materias);
    }


    public function store(Request $request)
    {
        
        $dados = $request->only(['nome']); //adicionei o usuario id so pq nao da para autenticar ainda
        $id =  Auth::id();
        $materia = Materia::create([
            'nome'     => $dados['nome'],
            'usuario_id' => $id // pega o id do usuário autenticado
        ]);

        return response()->json($materia, 201); // 201 = código https que significa created; criado c sucesso

        
    }

    public function show($id)
    {
        $materia = Materia::where('id', $id)->where('usuario_id', Auth::id())->first();

        if (!$materia) {
            return response()->json(['message' => 'Matéria não encontrada'], 404);
        }

        return response()->json($materia);
    }


    public function update(Request $request, $id)
    {
        $materia = Materia::where('id', $id)->where('usuario_id', Auth::id())->first();

        if (!$materia) {
            return response()->json(['message' => 'Matéria não encontrada'], 404);
        }

        $dados = $request->only(['nome']);
        $materia->fill($dados);
        $materia->save();

        return response()->json($materia);
    }


    public function destroy($id)
    {
        $materia = Materia::where('id', $id)->where('usuario_id', Auth::id())->first();

        if (!$materia) {
            return response()->json(['message' => 'Matéria não encontrada'], 404);
        }

        $materia->delete();
        return response()->json(['message' => 'Matéria deletada com sucesso.'], 200);
    }
}
