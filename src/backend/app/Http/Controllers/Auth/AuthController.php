<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash; // Importa a facade Hash para criptografar senhas
use Illuminate\Support\Facades\Validator; // Importa a facade Validator para validar dados

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // 1. Validação dos dados recebidos
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users', // unique:users verifica se o email já existe na tabela users
            'password' => 'required|string|min:8', // Mínimo de 8 caracteres para a senha
        ]);

        // 2. Se a validação falhar, retorna os erros
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422); // 422 Unprocessable Entity
        }

        // 3. Cria o usuário no banco de dados
        try {
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')), // Criptografa a senha ANTES de salvar
            ]);

            // 4. Retorna uma resposta de sucesso
            return response()->json([
                'message' => 'Usuário registrado com sucesso!',
                'user' => $user // Retorna os dados do usuário criado (sem a senha, pois está no $hidden)
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao registrar usuário.'], 500); // 500 Internal Server Error
        }
    }
    public function login(Request $request)
    {
        // 1. Validação dos dados recebidos
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // 2. Se a validação falhar, retorna os erros
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // 3. Tenta encontrar o usuário pelo email
        $user = User::where('email', $request->input('email'))->first();

        // 4. Verifica se o usuário existe e se a senha está correta
        if (!$user || !Hash::check($request->input('password'), $user->password)) {
            // Se o usuário não existe OU a senha não bate
            return response()->json(['message' => 'Credenciais inválidas.'], 401); // 401 Unauthorized
        }

        // 5. Login bem-sucedido
        // retorna os dados do usuário
        // (Em um app real, você geraria um token JWT ou similar aqui)
        return response()->json([
            'message' => 'Login bem-sucedido!',
            'user' => $user // Retorna os dados do usuário logado (sem a senha)
        ], 200);
    }
}
