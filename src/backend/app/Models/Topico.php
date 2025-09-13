<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Topico extends Model
{
    protected $table = "topicos";
    protected $fillable = [
         'materia_id',
         'titulo',
         'descricao',
         'status',
         'nivel'
    ];
    protected $primaryKey = 'id';

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'materia_id');
    }

}
