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
        Schema::create('materias', function (Blueprint $table) { 
            $table->increments('id'); 
            $table->unsignedBigInteger('usuario_id');
            $table->string('nome', 255); 
            $table->enum('dificuldade', ['fácil', 'médio','difícil'])->default('médio'); 

            $table->foreign('usuario_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->timestamps(); 
        }); 
    } 

    /**
     * Reverse the migrations.
     */
    public function down(): void 
    { 
        Schema::dropIfExists('materias'); 
    }
};
