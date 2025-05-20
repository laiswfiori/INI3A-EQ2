<?php

/** @var \Laravel\Lumen\Routing\Router $router */

$router->get('/', function () {
    return 'Hello, world!';
});

// Rotas públicas para registro e login (sem middleware)
$router->group(['prefix' => 'auth'], function () use ($router) {
    $router->post('register', 'AuthController@register');
    $router->post('login', 'AuthController@login');
});

// Rotas protegidas por autenticação JWT (middleware 'auth')
$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->group(['prefix' => 'materias'], function () use ($router) {
        $router->get('/', 'MateriasController@index');
        $router->post('/', 'MateriasController@store');
        $router->get('/{id}', 'MateriasController@show');
        $router->put('/{id}', 'MateriasController@update');
        $router->delete('/{id}', 'MateriasController@destroy');
    });

    // Aqui pode colocar outras rotas protegidas, se quiser
});

// Rotas públicas (sem middleware) — você pode proteger se desejar
$router->group(['prefix' => 'topicos'], function () use ($router) {
    $router->get('/', 'TopicosController@index');
    $router->post('/', 'TopicosController@store');
    $router->get('/{id}', 'TopicosController@show');
    $router->put('/{id}', 'TopicosController@update');
    $router->delete('/{id}', 'TopicosController@destroy');
});

$router->group(['prefix' => 'atividades'], function () use ($router) {
    $router->get('/', 'AtividadesController@index');
    $router->post('/', 'AtividadesController@store');
    $router->get('/{id}', 'AtividadesController@show');
    $router->put('/{id}', 'AtividadesController@update');
    $router->delete('/{id}', 'AtividadesController@destroy');
});

$router->group(['prefix' => 'password'], function () use ($router) {
    $router->post('request-reset', 'PasswordResetController@requestReset');
    $router->post('reset', 'PasswordResetController@resetPassword');
});

$router->group(['prefix' => 'flashcards'], function () use ($router) {
    $router->get('/', 'FlashcardsController@index');
    $router->post('/', 'FlashcardsController@store');
    $router->get('/{id}', 'FlashcardsController@show');
    $router->put('/{id}', 'FlashcardsController@update');
    $router->delete('/{id}', 'FlashcardsController@destroy');
});

$router->group(['prefix' => 'cards'], function () use ($router) {
    $router->get('/', 'CardsController@index');
    $router->post('/', 'CardsController@store');
    $router->get('/{id}', 'CardsController@show');
    $router->put('/{id}', 'CardsController@update');
    $router->delete('/{id}', 'CardsController@destroy');
});
