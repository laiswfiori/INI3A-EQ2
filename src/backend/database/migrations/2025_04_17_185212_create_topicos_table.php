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
        Schema::create('topicos', function (Blueprint $table) {
            $table->increments('id');
            $table->foreign('usuario_id')->references('id')->on('usuarios');
            $table->string('titulo', 255);
            $table->string('descricao', 255)->nullable();
            $table->enum('status', ['concluído', 'em andamento', 'não iniciado']);
            $table->enum('nivel', ['muito fácil', 'fácil', 'médio','difícil','muito difícil'])->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topicos');
    }
};
