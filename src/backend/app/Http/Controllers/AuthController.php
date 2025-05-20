<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Tymon\JWTAuth\Facades\JWTAuth; // pro token

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $user = User::create([
                'name' => $request->input('name'),
                'email' => $request->input('email'),
                'password' => Hash::make($request->input('password')),
            ]);

            // Gera o token JWT após criar o usuário
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'message' => 'Usuário registrado com sucesso!',
                'user' => $user,
                'token' => $token // Retorna o token
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Erro ao registrar usuário.'], 500);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verifica as credenciais e tenta gerar o token
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['message' => 'Credenciais inválidas.'], 401);
        }

        // Recupera o usuário autenticado
        $user = auth()->user();

        return response()->json([
            'message' => 'Login bem-sucedido!',
            'user' => $user,
            'token' => $token
        ], 200);
    }
}
