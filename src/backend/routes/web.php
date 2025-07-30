<?php

/** @var \Laravel\Lumen\Routing\Router $router */

// Rota principal da aplicação
$router->get('/', function () {
    return 'API do TCC está no ar! ' . app()->version();
});

// --- Rotas de Autenticação ---
$router->group(['prefix' => 'api'], function () use ($router) {
    $router->post('register', 'AuthController@register');
    $router->post('login', 'AuthController@login');
});

// --- Rotas de Redefinição de Senha ---
$router->group(['prefix' => 'password'], function () use ($router) {
    // Rota: POST /password/request-reset
    // ATENÇÃO: O método no controller deve se chamar 'requestReset'
    $router->post('request-reset', 'PasswordResetController@requestReset');

    // Rota: POST /password/reset
    // ATENÇÃO: O método no controller deve se chamar 'resetPassword'
    $router->post('reset', 'PasswordResetController@resetPassword');
});

$router->group(['middleware' => 'auth'], function () use ($router) {

    // --- Rotas de Gerenciamento de Usuário e Perfil (prefixo 'api') ---
    $router->group(['prefix' => 'api'], function () use ($router) {
        $router->get('profile', 'UserController@profile');
        $router->put('profile', 'UserController@updateProfile');
        $router->put('usuario/alterar-senha', 'UserController@changePassword');
        $router->delete('user', 'UserController@deleteAccount');

        // Rotas de listagem de usuários
        $router->get('users/{id}', 'UserController@singleUser');
        $router->get('users', 'UserController@allUsers');
    });

     // --- Rotas de Preferências de Estudo (ATUALIZADO) ---
    $router->group(['prefix' => 'agenda_configuracoes'], function () use ($router) {
        $router->get('/', 'AgendaConfiguracaoController@index');
        $router->post('/', 'AgendaConfiguracaoController@store');
    });


    // --- Rotas de Tópicos ---
    $router->group(['prefix' => 'topicos'], function () use ($router) {
        $router->get('/', 'TopicosController@index');
        $router->post('/', 'TopicosController@store');
        $router->get('/{id}', 'TopicosController@show');
        $router->put('/{id}', 'TopicosController@update');
        $router->delete('/{id}', 'TopicosController@destroy');
    });

    // --- Rotas de Matérias ---
    $router->group(['prefix' => 'materias'], function () use ($router) {
        $router->get('/', 'MateriasController@index');
        $router->post('/', 'MateriasController@store');
        $router->get('/{id}', 'MateriasController@show');
        $router->put('/{id}', 'MateriasController@update');
        $router->delete('/{id}', 'MateriasController@destroy');
    });

    // --- Rotas de Atividades ---
    $router->group(['prefix' => 'atividades'], function () use ($router) {
        $router->get('/', 'AtividadesController@index');
        $router->post('/', 'AtividadesController@store');
        $router->get('/{id}', 'AtividadesController@show');
        $router->put('/{id}', 'AtividadesController@update');
        $router->delete('/{id}', 'AtividadesController@destroy');
    });

    // --- Rotas de Flashcards ---
    $router->group(['prefix' => 'flashcards'], function () use ($router) {
        $router->get('/', 'FlashcardsController@index');
        $router->post('/', 'FlashcardsController@store');
        $router->get('/{id}', 'FlashcardsController@show');
        $router->put('/{id}', 'FlashcardsController@update');
        $router->delete('/{id}', 'FlashcardsController@destroy');
    });

    // --- Rotas de Cards ---
    $router->group(['prefix' => 'cards'], function () use ($router) {
        $router->get('/', 'CardsController@index');
        $router->post('/', 'CardsController@store');
        $router->get('/{id}', 'CardsController@show');
        $router->put('/{id}', 'CardsController@update');
        $router->delete('/{id}', 'CardsController@destroy');
    });

    // --- Rotas de Agenda Eventos ---
    $router->group(['prefix' => 'agendaEventos'], function () use ($router) {
        $router->get('/', 'AgendaEventosController@index');
        $router->post('/', 'AgendaEventosController@store');
        $router->get('/{id}', 'AgendaEventosController@show');
        $router->put('/{id}', 'AgendaEventosController@update');
        $router->delete('/{id}', 'AgendaEventosController@destroy');
    });

    // --- Rotas de Agenda Configurações ---
    $router->group(['prefix' => 'agendaConfiguracao'], function () use ($router) {
        $router->get('/', 'AgendaConfiguracaoController@index');
        $router->post('/', 'AgendaConfiguracaoController@store');
        //$router->get('/{id}', 'AgendaConfiguracaoController@show');
        //$router->put('/{id}', 'AgendaConfiguracaoController@update');
        //$router->delete('/{id}', 'AggendaConfiguracaoController@destroy');
    });

    // --- Rotas de Agenda Dia Disponível ---
    $router->group(['prefix' => 'agendaDiaDisponivel'], function () use ($router) {
        $router->get('/', 'AgendaDiaDisponivelController@index');
        //$router->post('/', 'AgendaDiaDisponivelController@store');
        //$router->get('/{id}', 'AgendaDiaDisponivelController@show');
        $router->put('/{id}', 'AgendaDiaDisponivelController@update');
        $router->delete('/{id}', 'AgendaDiaDisponivelController@destroy');
    });

    $router->get('calendarioEstudos/', 'CalendarioEstudosController@gerarAgenda');
});