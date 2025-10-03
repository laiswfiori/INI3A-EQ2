<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Models\Atividade;
use App\Models\Flashcard;
use App\Observers\AtividadeObserver;
use App\Observers\FlashcardObserver;

class AppServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Registrar o service no container
        $this->app->singleton(\App\Services\NivelCalculoService::class);
    }

    public function boot()
    {
        // Registrar os observers
        Atividade::observe(AtividadeObserver::class);
        Flashcard::observe(FlashcardObserver::class);
    }
}