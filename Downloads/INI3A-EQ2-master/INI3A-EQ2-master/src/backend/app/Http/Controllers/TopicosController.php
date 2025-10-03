<?php

namespace App\Http\Controllers;

use App\Models\Topico;
use App\Models\Materia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Symfony\Component\ErrorHandler\Debug;
use Illuminate\Support\Facades\Log;

class TopicosController extends Controller
{
    
    // :: => operador de resolução de escopo; acessa o model (estático)
    public function __construct()
    {
       $this->middleware('auth');//erro 401
    }

    //Auth::user() retorna o objeto do usuário logado
    //Auth::id() retorna o ID do usuário autenticado
    public function index()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Usuário não autenticado.'], 401);
        }

        $topicos = Topico::all();
        return response()->json($topicos);
    }



    public function store(Request $request)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Usuário não autenticado.'], 401);
        }
        
        $dados = $request->only(['titulo', 'descricao', 'materia_id']); //adicionei o materia id so pq nao da para autenticar ainda
        $topico = Topico::create([
                'titulo'     => $dados['titulo'],
                'descricao'  => $dados['descricao'],
                'status'     => 'não iniciado',
                'materia_id'     => $dados['materia_id'],
                'nivel' => null,
            ]);        
        

        return response()->json($topico, 201); // 201 = código https que significa created; criado c sucesso

        
    }

    public function show($id)
    {
        $topico = Topico::findOrFail($id); // caso a função n achar ela retorna 404-> not found-> automaticamente
        return response()->json($topico);
    }


    public function update(Request $request, $id)
    {
        $topico = Topico::findOrFail($id); // 404 se não encontrar
        $dados = $request->only(['titulo', 'descricao', 'status']);//liberados no fillable do model
        $topico->fill($dados); // mescla os dados
        $topico->save(); // salva no banco
        return response()->json($topico);
    }

    public function destroy($id)
    {
        // Busca o tópico ou lança um erro 404 se não encontrar
        $topico = Topico::findOrFail($id);
        $topico->delete();// Delete = lumen eloquent-> deleta o tópico do bdd
        return response()->json(['message' => 'Tópico deletado com sucesso.'], 200); // 200 = OK; Retorna uma mensagem de sucesso
    }
}
