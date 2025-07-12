<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration 
{
    public function up()
    {
        Schema::create('agenda_dias_disponiveis', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('agenda_configuracao_id');
            $table->enum('dia_semana', ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo']);
            $table->time('hora_inicio');
            $table->time('hora_fim');
            $table->unsignedBigInteger('materia_id')->nullable();
            $table->timestamps();

            $table->foreign('agenda_configuracao_id')->references('id')->on('agenda_configuracoes')->onDelete('cascade');
            $table->foreign('materia_id')->references('id')->on('materias')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::dropIfExists('agenda_dias_disponiveis');
    }

};

