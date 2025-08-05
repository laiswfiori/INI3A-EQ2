<?php

return [

    /*
    |--------------------------------------------------------------------------
    | JWT Authentication Secret
    |--------------------------------------------------------------------------
    |
    | Não se esqueça de definir isso no seu arquivo .env, pois será usado para
    | assinar seus tokens. Um comando auxiliar (`php artisan jwt:secret` no Laravel,
    | ou gere uma chave aleatória para o Lumen) é fornecido para gerar uma chave segura.
    |
    */

    'secret' => env('JWT_SECRET'),

    /*
    |--------------------------------------------------------------------------
    | JWT Time to Live
    |--------------------------------------------------------------------------
    |
    | Especifique o tempo (em minutos) que o token será válido.
    |
    */

    // ALTERAÇÃO 1: Mude o 'ttl' para 15 minutos.
    // Isso garante que se o usuário fechar o site, o token será inválido após 15 minutos.
    'ttl' => env('JWT_TTL', 2000),

    /*
    |--------------------------------------------------------------------------
    | Refresh Time to Live
    |--------------------------------------------------------------------------
    |
    | Especifique o tempo (em minutos) que o token pode ser renovado.
    |
    */

    // ALTERAÇÃO 2: Mude o 'refresh_ttl' para um valor alto, como 2 semanas (20160 minutos).
    // Isso permite que o frontend continue renovando o token enquanto a aba estiver aberta.
    'refresh_ttl' => env('JWT_REFRESH_TTL', 20160),

    /*
    |--------------------------------------------------------------------------
    | JWT Signing Algorithm
    |--------------------------------------------------------------------------
    |
    | O algoritmo usado para assinar seus tokens.
    |
    */

    'algo' => env('JWT_ALGO', 'HS256'),

    /*
    |--------------------------------------------------------------------------
    | Blacklist
    |--------------------------------------------------------------------------
    |
    | Para invalidar tokens, você deve ter a blacklist habilitada.
    |
    */

    'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),
];
