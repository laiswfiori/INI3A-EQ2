<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CalendarioEstudos extends Migration
{
    public function up()
    {
        Schema::create('calendario_estudos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('usuario_id');
            $table->unsignedBigInteger('materia_id');
            $table->string('dia'); // exemplo: 'segunda', 'terca'...
            $table->time('hora_inicio');
            $table->time('hora_fim');
            $table->json('revisoes'); // array de datas de revisão
            $table->timestamps();

            $table->unique(['usuario_id', 'materia_id', 'dia', 'hora_inicio', 'hora_fim'], 'agenda_unica');
        });
    }

    public function down()
    {
        Schema::dropIfExists('calendario_estudos');
    }
}
