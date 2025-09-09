<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Google_Client;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'surname' => $request->surname,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'streak' => 1,
            'last_streak_update' => Carbon::today(),
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

        try {
            $googleClientId = env('GOOGLE_CLIENT_ID');
            if (!$googleClientId) {
                return response()->json(['message' => 'Google Client ID não configurado no servidor.'], 500);
            }

            $googleClient = new Google_Client(['client_id' => $googleClientId]);
            $payload = $googleClient->verifyIdToken($request->token);

            if (!$payload) {
                return response()->json(['message' => 'Token do Google inválido.'], 401);
            }

            // --- LÓGICA MELHORADA COMEÇA AQUI ---

            // 1. Procura o usuário pelo e-mail recebido do Google.
            $user = User::where('email', $payload['email'])->first();

            if ($user) {
                // 2. Se o usuário JÁ EXISTE, apenas garantimos que o google_id está salvo.
                // Isso vincula a conta do Google a uma conta já existente (se o usuário se cadastrou via e-mail/senha antes).
                $user->google_id = $payload['sub'];
                $user->save();
            } else {
                // 3. Se o usuário NÃO EXISTE, nós o criamos.
                $user = User::create([
                    'google_id' => $payload['sub'],
                    'email' => $payload['email'],
                    'name'  => $payload['given_name'] ?? ($payload['name'] ?? ''),
                    'surname' => $payload['family_name'] ?? '',
                    'password' => null // Senha nula, pois a autenticação é via Google
                ]);
            }

            // --- FIM DA LÓGICA MELHORADA ---

            // Loga o usuário (seja o que encontramos ou o que criamos) e retorna o token.
            $token = Auth::login($user);

            if (!$token) {
                return response()->json(['message' => 'Não foi possível autenticar o usuário.'], 500);
            }

            return $this->respondWithToken($token);

        } catch (\Exception $e) {
            // Log::error('Erro no callback do Google: ' . $e->getMessage()); // Descomente para depurar se necessário
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