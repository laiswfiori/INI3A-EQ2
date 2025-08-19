<?php
    return [
        // ...
        'disks' => [
            // ...
            'public' => [
                'driver' => 'local',
                'root' => storage_path('app/public'),
                'url' => env('APP_URL').'/storage', // Importante para a URL pública
                'visibility' => 'public',
            ],
        ],
        // ...
        'links' => [
            base_path('public/storage') => storage_path('app/public'),
        ],
    ];
    