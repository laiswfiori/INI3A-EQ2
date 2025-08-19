<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgendaEventos extends Model
{

    protected $table = "agenda_eventos";
    protected $fillable = [
        'usuario_id',
        'nome',
        'data',
        'materias',
        'prioridade'
    ];
    protected $primaryKey = 'id';

}
