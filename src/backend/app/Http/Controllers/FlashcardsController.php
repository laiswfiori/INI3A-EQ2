<?php

namespace App\Http\Controllers;

use App\Models\Flashcard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FlashcardsController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Usuário não autenticado.'], 401);
        }

        $flashcards = Flashcard::all();
        return response()->json($flashcards);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'titulo' => 'required|string',
            'topico_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        $flashcard = Flashcard::create($data);

        return response()->json($flashcard, 201);
    }

    public function show($id)
    {
        $flashcard = Flashcard::findOrFail($id);

        /*
        // Caso queira proteger por usuário no futuro:
        // if ($flashcard->topico->usuario_id !== Auth::id()) {
        //     return response()->json(['message' => 'Acesso negado'], 403);
        // }
        */

        return response()->json($flashcard);
    }

    public function update(Request $request, $id)
    {
        $flashcard = Flashcard::findOrFail($id);

        $dados = $request->only([
            'titulo',
            'nivel'
        ]);

        $flashcard->update($dados);

        return response()->json($flashcard);
    }

    public function destroy($id)
    {
        $flashcard = Flashcard::findOrFail($id);

        /*
        // Caso queira proteger por usuário no futuro:
        // if ($flashcard->topico->usuario_id !== Auth::id()) {
        //     return response()->json(['message' => 'Acesso negado'], 403);
        // }
        */

        $flashcard->delete();

        return response()->json(['message' => 'Flashcard deletado com sucesso.'], 200);
    }
}
