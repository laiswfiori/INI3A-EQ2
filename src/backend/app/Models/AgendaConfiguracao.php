<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AgendaConfiguracao extends Model
{
    protected $table = 'agenda_configuracoes';

    protected $fillable = [
        'usuario_id',
        'data_inicio',
        'data_fim',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class);
    }

    public function diasDisponiveis()
    {
        return $this->hasMany(AgendaDiaDisponivel::class, 'agenda_configuracao_id');
    }
}
