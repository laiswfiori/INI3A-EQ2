<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Google_Client;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = Auth::login($user);

        return $this->respondWithToken($token);
    }
    
    public function login(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only(['email', 'password']);

        if (! $token = Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        return $this->respondWithToken($token);
    }

    public function handleGoogleCallback(Request $request)
    {
        $this->validate($request, [
            'token' => 'required|string',
        ]);

        $googleClientId = env('GOOGLE_CLIENT_ID');
        if (!$googleClientId) {
            return response()->json(['message' => 'Google Client ID não configurado no servidor.'], 500);
        }

        $googleClient = new Google_Client(['client_id' => $googleClientId]);

        try {
            $payload = $googleClient->verifyIdToken($request->token);

            if (!$payload) {
                return response()->json(['message' => 'Token do Google inválido.'], 401);
            }

            $user = User::firstOrCreate(
                ['google_id' => $payload['sub']], 
                [
                    'email' => $payload['email'],
                    'name'  => $payload['given_name'] ?? ($payload['name'] ?? ''),
                    'surname' => $payload['family_name'] ?? '',
                    'password' => null
                ]
            );

            $token = Auth::login($user);

            if (!$token) {
                return response()->json(['message' => 'Não foi possível autenticar o usuário.'], 500);
            }

            return $this->respondWithToken($token);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Ocorreu um erro na autenticação com Google.', 'error' => $e->getMessage()], 500);
        }
    }

    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'user' => auth()->user(),
            'expires_in' => config('jwt.ttl') * 60
        ]);
    }
}