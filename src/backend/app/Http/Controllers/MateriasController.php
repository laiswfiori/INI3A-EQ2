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
        
        $dados = $request->only(['nome', 'usuario_id']); //adicionei o usuario id so pq nao da para autenticar ainda
        $id =  Auth::id();
        $materia = Materia::create([
            // 'usuario_id'     => $dados['usuario_id'],
            'nome'     => $dados['nome'],
            'usuario_id' => $id // pega o id do usuário autenticado
        ]);

        return response()->json($materia, 201); // 201 = código https que significa created; criado c sucesso

        
    }

    public function show($id)
    {
        $materia = Materia::findOrFail($id); // caso a função n achar ela retorna 404-> not found-> automaticamente
        return response()->json($materia);
    }


    public function update(Request $request, $id)
    {
        $materia = Materia::findOrFail($id); // 404 se não encontrar
        $dados = $request->only(['nome']);//liberados no fillable do model
        $materia->fill($dados); // mescla os dados
        $materia->save(); // salva no banco
        return response()->json($materia);
    }

    public function destroy($id)
    {
        // Busca o tópico ou lança um erro 404 se não encontrar
        $materia = Materia::findOrFail($id);
        $materia->delete();// Delete = lumen eloquent-> deleta o tópico do bdd
        return response()->json(['message' => 'Matéria deletada com sucesso.'], 200); // 200 = OK; Retorna uma mensagem de sucesso
    }

    public function perfil()
    {
        $user = auth()->user();
        return response()->json($user);
    }
}
