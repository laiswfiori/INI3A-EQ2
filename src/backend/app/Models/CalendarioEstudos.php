<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CalendarioEstudos extends Model
{
    protected $table = 'calendario_estudos';

    protected $fillable = [
    'usuario_id',
    'materia_id',
    'dia',
    'hora_inicio',
    'hora_fim',
    'revisoes',
];


    protected $casts = [
        'revisoes' => 'array',
    ];
}
