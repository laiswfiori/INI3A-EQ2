<?php

namespace App\Observers;

use App\Models\Atividade;
use App\Services\NivelCalculoService;

class AtividadeObserver
{
    protected $nivelService;

    public function __construct(NivelCalculoService $nivelService)
    {
        $this->nivelService = $nivelService;
    }

    public function created(Atividade $atividade)
    {
        $this->nivelService->atualizarNivelTopico($atividade->topico_id);
    }

    public function updated(Atividade $atividade)
    {
        $this->nivelService->atualizarNivelTopico($atividade->topico_id);
    }

    public function deleted(Atividade $atividade)
    {
        $this->nivelService->atualizarNivelTopico($atividade->topico_id);
    }
}