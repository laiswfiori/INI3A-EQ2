<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Session\Flash\FlashBag;

class FlashcardsController extends Controller
{
    public function index()
    {
        // Retorna todas as atividades cujos tópicos pertencem ao usuário autenticado
        //$usuarioId = Auth::id();]
        
        $flashcards = Flashcard::all();

        /* $atividades = Atividade::whereHas('topico', function ($query) use ($usuarioId) {
            $query->where('usuario_id', $usuarioId);
        })->get(); */

        return response()->json($flashcards);
    }

    public function store(Request $request)
    {
        // Pega os dados diretamente da requisição
        $dados = $request->only([
            'topico_id',
            'titulo',
            'nivel'
        ]);

        // Cria uma nova atividade no banco de dados
        $flashcard = Flashcard::create($dados);

    }


    public function show($id)
    {
        $flashcard = Flashcard::findOrFail($id);

        // Verifica se o usuário é dono do tópico relacionado
        /*
        if ($atividade->topico->usuario_id !== Auth::id()) {
            return response()->json(['message' => 'Acesso negado'], 403);
        }
        */

        return response()->json($flashcard);
    }


    public function update(Request $request, $id)
    {
        $flashcard = Flashcard::findOrFail($id);

        // if ($atividade->topico->usuario_id !== Auth::id()) {
        //     return response()->json(['message' => 'Acesso negado'], 403);
        // }

        $dados = $request->only([
            'titulo',
            'nivel'
        ]);

        $flashcard->fill($dados);
        $flashcard->save();

        return response()->json($flashcard);
    }

    public function destroy($id)
    {
        $flashcard = Flashcard::findOrFail($id);

        // if ($atividade->topico->usuario_id !== Auth::id()) {
        //     return response()->json(['message' => 'Acesso negado'], 403);
        // }

        $flashcard->delete();

        return response()->json(['message' => 'Flashcard deletado com sucesso.'], 200);
    }
}
