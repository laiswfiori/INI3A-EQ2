<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('agenda_eventos', function (Blueprint $table) { 
            $table->increments('id'); 
            $table->unsignedBigInteger('usuario_id');
            $table->string('nome', 255); 
            $table->json('materias');
            $table->integer('prioridade');
            $table->dateTime('data');

            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->timestamps(); 
        }); 
    }
    public function down(): void
    {

    }
};
