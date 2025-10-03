<?php

namespace App\Observers;

use App\Models\Atividade;
use App\Services\NivelCalculoService;

class AtividadeObserver
{
    protected $nivelService;

    public function __construct()
    {
        $this->nivelService = app(NivelCalculoService::class);
    }


    public function updated(Atividade $atividade)
    {
        $this->nivelService->atualizarNivelTopico($atividade->topico_id);
    }

}