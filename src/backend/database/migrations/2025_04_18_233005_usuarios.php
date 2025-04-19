<?php use Illuminate\Database\Migrations\Migration; 
use Illuminate\Database\Schema\Blueprint; 
use Illuminate\Support\Facades\Schema; 

return new class extends Migration 
{ 
    /**
     * Run the migrations.
     */ 
    public function up(): void 
    { 
        Schema::create('usuarios', function (Blueprint $table) 
        { 
            $table->increments('id'); 
            $table->string('nome', 255); 
            $table->string('email', 255); 
            $table->string('senha', 255);
            $table->string('biografia', 255)->nullable(); 
            
            $table->timestamps(); 
        }); 
    } 

    /**
     * Reverse the migrations.
     */
    public function down(): void 
    { 
        Schema::dropIfExists('usuarios'); 
    } 
};