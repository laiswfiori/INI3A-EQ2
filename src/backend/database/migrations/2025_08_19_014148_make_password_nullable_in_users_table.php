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
        // Comando SQL para PostgreSQL que torna a coluna 'password' nula
        DB::statement('ALTER TABLE users ALTER COLUMN password DROP NOT NULL');
    }

    /**
     * Reverse the migrations.
     */
     public function down(): void
    {
        // Comando SQL para reverter, tornando a coluna obrigatória novamente
        DB::statement('ALTER TABLE users ALTER COLUMN password SET NOT NULL');
    }
};
