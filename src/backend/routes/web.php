<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use function Ramsey\Uuid\v1;

$router->get('/', function () {
    return 'Hello, world!';
});

// Rotas públicas para registro e login

$router->group(['prefix' => 'api'], function () use ($router) {
    // Matches "/api/register
   $router->post('register', 'AuthController@register');
     // Matches "/api/login
    $router->post('login', 'AuthController@login');

    // Matches "/api/profile
    $router->get('profile', 'UserController@profile');

    // Matches "/api/users/1
    //get one user by id
    $router->get('users/{id}', 'UserController@singleUser');

    // Matches "/api/users
    $router->get('users', 'UserController@allUsers');
});

// Rotas públicas (sem middleware) — você pode proteger se desejar
$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->get('/topicos', 'TopicosController@index');
    $router->post('/topicos', 'TopicosController@store');
    $router->get('/topicos/{id}', 'TopicosController@show');
    $router->put('/topicos/{id}', 'TopicosController@update');
    $router->delete('/topicos/{id}', 'TopicosController@destroy');
});

$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->get('/materias', 'MateriasController@index');
    $router->post('/materias', 'MateriasController@store');
    $router->get('/materias/{id}', 'MateriasController@show');
    $router->put('/materias/{id}', 'MateriasController@update');
    $router->delete('/materias/{id}', 'MateriasController@destroy');
});

$router->get('/teste-auth', ['middleware' => 'auth', function () use ($router) {
    return response()->json([
        'authenticated' => true,
        'user' => auth()->user()  // ou Auth::user() se estiver usando facade
    ]);
}]);

$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->get('/atividades', 'AtividadesController@index');
    $router->post('/atividades', 'AtividadesController@store');
    $router->get('/atividades/{id}', 'AtividadesController@show');
    $router->put('/atividades/{id}', 'AtividadesController@update');
    $router->delete('/atividades/{id}', 'AtividadesController@destroy');
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
