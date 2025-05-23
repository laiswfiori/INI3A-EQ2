<?php

return [
    'defaults' => [
        'guard' => 'api',
        'passwords' => 'users',
    ],

    'guards' => [
        'api' => [
            'driver' => 'jwt',  // 'jwt' no lugar de 'token' pq estamos usando jwt
            'provider' => 'users',
        ],
    ],

    'providers' => [
    'users' => [
            'driver' => 'eloquent',
            'model' => App\Models\User::class,
        ],
    ],


    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => 'password_resets',
            'expire' => 60,
        ],
    ],
];
