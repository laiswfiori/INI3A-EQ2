<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgendaDiaDisponivel extends Model
{
    protected $table = 'agenda_dias_disponiveis';

    protected $fillable = [
        'agenda_configuracao_id',
        'dia_semana',
        'hora_inicio',
        'hora_fim',
        'materia_ids',
    ];

    protected $casts = [
        'materia_ids' => 'array',
    ];

    public function configuracao()
    {
        return $this->belongsTo(AgendaConfiguracao::class, 'agenda_configuracao_id');
    }

    public function materias()
    {
        return \App\Models\Materia::whereIn('id', $this->materia_ids ?? [])->get();
    }
}
