<?php

namespace App\Http\Controllers;

use App\Models\Atividade;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;


class AtividadesController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Usuário não autenticado.'], 401);
        }
        
        $atividades = Atividade::all();

        return response()->json($atividades);
    }


public function store(Request $request)
{
    $validator = Validator::make($request->all(), [
        'titulo' => 'required|string',
        'descricao' => 'nullable|string',
        'topico_id' => 'required|integer',
        'status' => 'required|string',
        'tipo' => 'required|string',
        'conteudo' => 'nullable|array',
        'conteudo.*.tipo' => 'required|in:texto,imagem,arquivo',
        'conteudo.*.valor' => 'required|string',
        'conteudo.*.nome' => 'nullable|string',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 422);
    }

    $data = $validator->validated();

    $data['conteudo'] = json_encode($data['conteudo']);

    $atividade = Atividade::create($data);

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
