<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Materia extends Model 
{

    protected $table = "materias";
    protected $fillable = [
        'usuario_id',
        'nome', 
        'dificuldade',
    ];
    protected $primaryKey = 'id';

}
