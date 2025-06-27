<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;


class PasswordResetController extends Controller
{
    /**
     * Cria e envia o link de redefinição de senha para o e-mail do usuário.
     */
    public function requestReset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $token = Str::random(60);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => $token,
                'created_at' => Carbon::now()
            ]
        );
        
        $this->sendResetEmail($request->email, $token);
        
        return response()->json(['message' => 'Um link de redefinição foi enviado para o seu e-mail.'], 200);
    }

    /**
     * Valida o token e redefine a senha do usuário.
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $expiresInMinutes = config('auth.passwords.users.expire', 60);

        $resetRecord = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$resetRecord || Carbon::parse($resetRecord->created_at)->addMinutes($expiresInMinutes)->isPast()) {
            return response()->json(['message' => 'Este token de redefinição é inválido ou expirou.'], 400);
        }
        
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'Usuário não encontrado.'], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_resets')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Sua senha foi redefinida com sucesso.']);
    }

    /**
     * Função auxiliar para enviar o e-mail de redefinição de senha.
     */
    private function sendResetEmail($email, $token)
    {
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:8100');
        $resetUrl = "{$frontendUrl}/redefinir-senha?token={$token}&email=" . urlencode($email);

        $subject = 'Seu Link para Redefinição de Senha';
        $body = "Olá,\n\n" .
                "Você está recebendo este e-mail porque recebemos um pedido de redefinição de senha para sua conta.\n" .
                "Clique no link abaixo para redefinir sua senha:\n" .
                $resetUrl . "\n\n" .
                "Este link de redefinição de senha irá expirar em 60 minutos.\n" .
                "Se você não solicitou uma redefinição de senha, nenhuma ação é necessária.\n\n" .
                "Atenciosamente,\n" .
                env('APP_NAME');

        // Pede o 'mailer' diretamente ao app para contornar erros de injeção de dependência.
        app('mailer')->raw($body, function ($message) use ($email, $subject) {
            $message->to($email)
                    ->subject($subject);
        });
    }
}