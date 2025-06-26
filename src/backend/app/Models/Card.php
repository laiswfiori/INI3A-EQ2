<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Card extends Model 
{
    protected $table = "cards";

    protected $fillable = [
        'flashcard_id',
        'conteudo_frente',
        'conteudo_verso',
        'nivel'
    ];

    protected $casts = [
        'conteudo_frente' => 'array',
        'conteudo_verso' => 'array',
    ];

    protected $primaryKey = 'id';
}
