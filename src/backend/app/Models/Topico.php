<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Topico extends Model
{
    protected $table = "topicos";
    protected $fillable = [
         'usuario_id',
         'titulo',
         'descricao',
         'status',
         'nivel'
    ];

}
