<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

/*$router->get('/', function () use ($router) {
    return $router->app->version();
});*/

// Modelo: $router->get('foo', ['uses' => 'FooController@method', 'as' => 'name']);
$router->get('/', function () {
    return 'Hello, world!';
});

$router->group(['prefix' => 'materias'], function() use($router)
{
    $router->get('/', 'MateriasController@index'); //get=lê/busca dados
    $router->post('/', 'MateriasController@store'); //cria recurso
    $router->get('/{id}', 'MateriasController@show');
    $router->put('/{id}', 'MateriasController@update'); //Put tualiza todos os dados; PATCH atualiza parcialmente (só os enviados)
    $router->delete('/{id}', 'MateriasController@destroy');//a$router->group (['prefix'=>'atividades'], function() use[$router])paga recurso
});

$router->group(['prefix' => 'topicos'], function() use($router)
{
    $router->get('/', 'TopicosController@index'); //get=lê/busca dados
    $router->post('/', 'TopicosController@store'); //cria recurso
    $router->get('/{id}', 'TopicosController@show');
    $router->put('/{id}', 'TopicosController@update'); //Put tualiza todos os dados; PATCH atualiza parcialmente (só os enviados)
    $router->delete('/{id}', 'TopicosController@destroy');//a$router->group (['prefix'=>'atividades'], function() use[$router])paga recurso
});

$router->group(['prefix' => 'atividades'], function() use($router)
{   $router->get('/', 'AtividadesController@index');
    $router->post('/', 'AtividadesController@store');
    $router->get('/{id}', 'AtividadesController@show');
    $router->put('/{id}', 'AtividadesController@update');
    $router->delete('/{id}', 'AtividadesController@destroy');
});

$router->group(['prefix' => 'auth'], function () use ($router) {
    $router->post('register', 'AuthController@register');
    $router->post('login', 'AuthController@login');
});

$router->group(['prefix' => 'flahscards'], function() use($router)
{   $router->get('/', 'FlashcardsController@index');
    $router->post('/', 'FlashcardsController@store');
    $router->get('/{id}', 'FlashcardsController@show');
    $router->put('/{id}', 'FlashcardsController@update');
    $router->delete('/{id}', 'FlashcardsController@destroy');
});

$router->group(['prefix' => 'cards'], function() use($router)
{   $router->get('/', 'CardsController@index');
    $router->post('/', 'CardsController@store');
    $router->get('/{id}', 'CardsController@show');
    $router->put('/{id}', 'CardsController@update');
    $router->delete('/{id}', 'CardsController@destroy');
});
