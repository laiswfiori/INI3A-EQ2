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
        Schema::create('cards', function (Blueprint $table) { 
            $table->increments('id'); 
            $table->unsignedBigInteger('flashcard_id'); // Corrigido aqui
            $table->jsonb('conteudo_frente'); 
            $table->jsonb('conteudo_verso'); 
            $table->enum('nivel', ['muito fácil', 'fácil', 'médio','difícil','muito difícil'])->nullable(); 
            
            $table->foreign('flashcard_id')->references('id')->on('flashcards')->onDelete('cascade'); // Corrigido aqui

            $table->timestamps(); 
        }); 
    } 

    /**
     * Reverse the migrations.
     */
    public function down(): void 
    { 
        Schema::dropIfExists('cards'); 
    } 
};