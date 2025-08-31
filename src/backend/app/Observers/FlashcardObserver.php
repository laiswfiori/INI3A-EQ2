<?php 
namespace App\Observers;

use App\Models\Flashcard;
use App\Services\NivelCalculoService;

class FlashcardObserver
{
    protected $nivelService;

    public function __construct(NivelCalculoService $nivelService)
    {
        $this->nivelService = $nivelService;
    }

    public function created(Flashcard $flashcard)
    {
        $this->nivelService->atualizarNivelTopico($flashcard->topico_id);
    }

    public function updated(Flashcard $flashcard)
    {
        $this->nivelService->atualizarNivelTopico($flashcard->topico_id);
    }

    public function deleted(Flashcard $flashcard)
    {
        $this->nivelService->atualizarNivelTopico($flashcard->topico_id);
    }
}
?>