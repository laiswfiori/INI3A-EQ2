<?php

namespace App\Http\Controllers;

use App\Models\Topico;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class TopicosController extends Controller
{
    
    // :: => operador de resolução de escopo; acessa o model (estático)
    public function __construct()
    {
       
    }

    //Auth::user() retorna o objeto do usuário logado
    //Auth::id() retorna o ID do usuário autenticado
    public function index()
    {
        $usuarioId = Auth::id(); // pega o ID do usuário autenticado
        $topicos = Topico::where('usuario_id', $usuarioId)->get();
        return response()->json($topicos);
    }


    public function store(Request $request)
    {
        $dados = $request->only(['titulo', 'descricao', 'status']);

        $topico = Topico::create([
            'titulo'     => $dados['titulo'],
            'descricao'  => $dados['descricao'],
            'status'     => $dados['status'],
            'usuario_id' => Auth::id(), // pega o id do usuário autenticado
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
