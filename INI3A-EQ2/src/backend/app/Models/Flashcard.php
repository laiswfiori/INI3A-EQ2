<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Flashcard extends Model 
{

    protected $table = "flashcards";
    protected $fillable = [
        'topico_id',
        'titulo',
        'nivel'
    ];
    protected $primaryKey = 'id';

}
