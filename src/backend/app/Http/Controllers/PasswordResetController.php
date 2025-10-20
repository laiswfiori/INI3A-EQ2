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


    private function sendResetEmail($email, $token)
    {
        $frontendUrl = env('FRONTEND_URL', 'http://eq2.ini3a.projetoscti.com.br');
        $resetUrl = "{$frontendUrl}/senha/alterar?token={$token}&email=" . urlencode($email);

        $subject = 'Seu Link para alteração de Senha';
        $body = "Olá,\n\n" .
                "Você está recebendo este e-mail porque recebemos um pedido de alteração de senha para sua conta.\n" .
                "Clique no link abaixo para alterar sua senha:\n" .
                $resetUrl . "\n\n" .
                "Este link de alteração de senha irá expirar em 60 minutos.\n" .
                "Se você não solicitou uma alteração de senha, nenhuma ação é necessária.\n\n" .
                "Atenciosamente,\n" .
                env('APP_NAME');

        app('mailer')->raw($body, function ($message) use ($email, $subject) {
            $message->to($email)
                    ->subject($subject);
        });
    }
}