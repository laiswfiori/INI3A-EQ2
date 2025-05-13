<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CardsController extends Controller
{
    public function index()
    {
        // Retorna todas as atividades cujos tópicos pertencem ao usuário autenticado
        //$usuarioId = Auth::id();]
        
        $cards = Card::all();

        /* $atividades = Atividade::whereHas('topico', function ($query) use ($usuarioId) {
            $query->where('usuario_id', $usuarioId);
        })->get(); */

        return response()->json($cards);
    }

    public function store(Request $request)
    {
        // Pega os dados diretamente da requisição
        $dados = $request->only([
            'flashcard_id',
            'conteudo_frente',
            'conteudo_verso',
            'nivel'
        ]);

        // Cria uma nova atividade no banco de dados
        $card = Card::create($dados);

        // Retorna a atividade criada como resposta com código 201 (Created)
        return response()->json($card, 201);
    }


    public function show($id)
    {
        $card = Card::findOrFail($id);

        // Verifica se o usuário é dono do tópico relacionado
        /*
        if ($atividade->topico->usuario_id !== Auth::id()) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }
        */

        return response()->json($card);
    }


    public function update(Request $request, $id)
    {
        $card = Card::findOrFail($id);

        // if ($atividade->topico->usuario_id !== Auth::id()) {
        //     return response()->json(['message' => 'Acesso negado'], 403);
        // }

        $dados = $request->only([
            'conteudo_frente',
            'conteudo_verso',
            'nivel'
        ]);

        $card->fill($dados);
        $card->save();

        return response()->json($card);
    }

    public function destroy($id)
    {
        $card = Card::findOrFail($id);

        // if ($atividade->topico->usuario_id !== Auth::id()) {
        //     return response()->json(['message' => 'Acesso negado'], 403);
        // }

        $card->delete();

        return response()->json(['message' => 'Card deletado com sucesso.'], 200);
    }
}
