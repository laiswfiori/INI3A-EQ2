<?php

namespace App\Http\Controllers;

use App\Models\Atividade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AtividadesController extends Controller
{
    public function index()
    {
        // Retorna todas as atividades cujos tópicos pertencem ao usuário autenticado
        //$usuarioId = Auth::id();]
        
        $atividades = Atividade::all();

        /* $atividades = Atividade::whereHas('topico', function ($query) use ($usuarioId) {
            $query->where('usuario_id', $usuarioId);
        })->get(); */

        return response()->json($atividades);
    }

    public function store(Request $request)
    {
        // Pega os dados diretamente da requisição
        $dados = $request->only([
            'topico_id',
            'titulo',
            'descricao',
            'conteudo',
            'status',
            'tipo',
            'nivel'
        ]);

        // Cria uma nova atividade no banco de dados
        $atividade = Atividade::create($dados);

        // Retorna a atividade criada como resposta com código 201 (Created)
        return response()->json($atividade, 201);
    }


    public function show($id)
    {
        $atividade = Atividade::findOrFail($id);

        // Verifica se o usuário é dono do tópico relacionado
        /*
        if ($atividade->topico->usuario_id !== Auth::id()) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }
        */

        return response()->json($atividade);
    }


    public function update(Request $request, $id)
    {
        $atividade = Atividade::findOrFail($id);

        // if ($atividade->topico->usuario_id !== Auth::id()) {
        //     return response()->json(['message' => 'Acesso negado'], 403);
        // }

        $dados = $request->only([
            'titulo',
            'descricao',
            'conteudo',
            'status',
            'tipo',
            'nivel'
        ]);

        $atividade->fill($dados);
        $atividade->save();

        return response()->json($atividade);
    }

    public function destroy($id)
    {
        $atividade = Atividade::findOrFail($id);

        // if ($atividade->topico->usuario_id !== Auth::id()) {
        //     return response()->json(['message' => 'Acesso negado'], 403);
        // }

        $atividade->delete();

        return response()->json(['message' => 'Atividade deletada com sucesso.'], 200);
    }
}
