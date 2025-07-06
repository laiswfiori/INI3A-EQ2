<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CardsController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    public function index(Request $request)
    {
        $query = Card::query();

        // Se passou flashcard_id na query, filtra
        if ($request->has('flashcard_id')) {
            $query->where('flashcard_id', $request->input('flashcard_id'));
        }

        $cards = $query->get();

        return response()->json($cards);
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'flashcard_id' => 'required|integer',
            'conteudo_frente' => 'nullable|array',
            'conteudo_frente.*.tipo' => 'required|in:texto,imagem,arquivo',
            'conteudo_frente.*.valor' => 'required|string',
            'conteudo_frente.*.nome' => 'nullable|string',
            'conteudo_verso' => 'nullable|array',
            'conteudo_verso.*.tipo' => 'required|in:texto,imagem,arquivo',
            'conteudo_verso.*.valor' => 'required|string',
            'conteudo_verso.*.nome' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        $card = Card::create($data);

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
