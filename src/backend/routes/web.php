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
$router->group(['prefix' => 'topicos'], function() use($router)
{
    $router->get('/', 'TopicosController@index'); //get=lê/busca dados
    $router->post('/', 'TopicosController@store'); //cria recurso
    $router->get('/{id}', 'TopicosController@show');
    $router->put('/{id}', 'TopicosController@update'); //Put tualiza todos os dados; PATCH atualiza parcialmente (só os enviados)
    $router->delete('/', 'TopicosController@destroy');//a$router->group (['prefix'=>'atividades'], function() use[$router])paga recurso
});

$router->group(['prefix' => 'atividades'], function() use($router)
{   $router->get('/', 'AtividadesController@index');
    $router->post('/', 'AtividadesController@store');
    $router->get('/{id}', 'AtividadesController@show');
    $router->put('/{id}', 'AtividadesController@update');
    $router->delete('/', 'AtividadesController@destroy');
});