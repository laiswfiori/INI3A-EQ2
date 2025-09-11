<?php

namespace App\Services;

use App\Models\Topico;
use App\Models\Materia;
use App\Models\Atividade;
use App\Models\Flashcard;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class NivelCalculoService
{
    private $mapNivelParaNumero = [
        'muito fácil' => 1,
        'fácil' => 2,
        'médio' => 3,
        'difícil' => 4,
        'muito difícil' => 5,
    ];
    
    private $mapNumeroParaNivel = [
        1 => 'muito fácil',
        2 => 'fácil',
        3 => 'médio',
        4 => 'difícil',
        5 => 'muito difícil',
    ];

    public function atualizarStreakSeNecessario()
    {
        $user = Auth::user(); // Corrigido: pega o usuário autenticado
        $hoje = Carbon::now()->toDateString();

        if ($user && $user instanceof \Illuminate\Database\Eloquent\Model && $user->last_streak_update !== $hoje) {
            $user->streak += 1;
            $user->last_streak_update = $hoje;
            $user->save();
        }
    }

    public function atualizarNivelTopico($topicoId)
    {
        $topico = Topico::find($topicoId);
        if (!$topico) return;

        // Buscar níveis de atividades e flashcards do tópico
        $atividades = Atividade::where('topico_id', $topicoId)->pluck('nivel');
        $flashcards = Flashcard::where('topico_id', $topicoId)->pluck('nivel');

        $todosNiveis = $atividades->merge($flashcards)->map(function ($nivel) {
            return $this->mapNivelParaNumero[$nivel] ?? 3;
        });

        if ($todosNiveis->isNotEmpty()) {
            $media = $todosNiveis->avg();
            $nivelAtribuido = round($media);
            $topico->nivel = $this->mapNumeroParaNivel[$nivelAtribuido] ?? 'médio';
            $topico->save();

            // Atualizar também o nível da matéria
            $this->atualizarNivelMateria($topico->materia_id);
        }
    }

    public function atualizarNivelMateria($materiaId)
    {
        $materia = Materia::find($materiaId);
        if (!$materia) return;

        $topicosNiveis = Topico::where('materia_id', $materiaId)
            ->pluck('nivel')
            ->map(function ($nivel) {
                return $this->mapNivelParaNumero[$nivel] ?? 3;
            });

        if ($topicosNiveis->isNotEmpty()) {
            $nivelMedio = $topicosNiveis->avg();

            if ($nivelMedio <= 2.5) {
                $dificuldadeTexto = 'fácil';
            } elseif ($nivelMedio <= 3.5) {
                $dificuldadeTexto = 'médio';
            } else {
                $dificuldadeTexto = 'difícil';
            }

            $materia->dificuldade = $dificuldadeTexto;
            $materia->save();
        }
        $this-> atualizarStreakSeNecessario();
    }

    public function recalcularTodosOsNiveis()
    {
        // Recalcular todos os tópicos
        $topicos = Topico::all();
        foreach ($topicos as $topico) {
            $this->atualizarNivelTopico($topico->id);
        }
    }
}