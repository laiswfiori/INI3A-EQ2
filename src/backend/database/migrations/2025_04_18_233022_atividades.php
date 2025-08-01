<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('atividades', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('topico_id');
            $table->string('titulo', 255);
            $table->string('descricao', 255)->nullable();
            $table->json('conteudo');
            $table->enum('status', ['concluído', 'em andamento', 'não iniciado']);
            $table->enum('tipo', ['resumo', 'lista', 'mapa mental','prova','anotações','tarefa','simulado']);
            $table->enum('nivel', ['muito fácil', 'fácil', 'médio','difícil','muito difícil'])->nullable();
            $table->date('data_entrega')->nullable();

            $table->foreign('topico_id')->references('id')->on('topicos')->onDelete('cascade');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('atividades');
    }
};
