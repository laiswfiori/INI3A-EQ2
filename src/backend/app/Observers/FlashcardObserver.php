<?php 
namespace App\Observers;

use App\Models\Flashcard;
use App\Services\NivelCalculoService;

class FlashcardObserver
{
    protected $nivelService;

    public function __construct()
    {
        $this->nivelService = app(NivelCalculoService::class);
    }
    
    public function updated(Flashcard $flashcard)
    {
        $this->nivelService->atualizarNivelTopico($flashcard->topico_id);
    }
}
?>