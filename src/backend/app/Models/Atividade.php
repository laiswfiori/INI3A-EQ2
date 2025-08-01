<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Atividade extends Model
{

    protected $table = "atividades";
    protected $fillable = [
        'topico_id',
        'titulo',
        'descricao',
        'conteudo',
        'status',
        'tipo',
        'nivel',
        'data_entrega'
    ];
    protected $casts = [
        'conteudo' => 'array',
    ];
    protected $primaryKey = 'id';

}
