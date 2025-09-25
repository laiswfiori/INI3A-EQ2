<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function profile()
    {
        return response()->json(['user' => Auth::user()], 200);
    }

    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $this->validate($request, [
            'name'      => 'required|string|max:255',
            'surname'   => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email,' . $user->id,
            'biography' => 'nullable|string',
        ]);
        
        if (!($user instanceof User)) {
            return response()->json(['message' => 'Authentication error: Could not get user model.'], 500);
        }
        
        $user->update($request->all());

        return response()->json([
            'message' => 'Profile updated successfully!',
            'user'    => $user
        ], 200);
    }

    public function atualizarFotoPerfil(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'foto_perfil' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::user();
        $imagemBase64 = $request->input('foto_perfil');

        // Deleta a foto antiga do armazenamento, se ela existir
        if ($user->foto_perfil) {
            // Remove o /storage/ do caminho para corresponder ao disco 'public'
            $pathAntigo = str_replace('/storage/', '', $user->foto_perfil);
            if (Storage::disk('public')->exists($pathAntigo)) {
                Storage::disk('public')->delete($pathAntigo);
            }
        }
        
        if ($imagemBase64) {
            // Se uma nova imagem foi enviada, salva ela
            try {
                $partes = explode(';', $imagemBase64);
                $mime = explode(':', $partes[0])[1];
                // Pega a extensão a partir do mime type, ex: "webp"
                $extensao = explode('/', $mime)[1];

                // Pega apenas os dados da imagem, depois da vírgula
                $file_data = substr($imagemBase64, strpos($imagemBase64, ',') + 1);

                // Cria o nome do arquivo com a extensão CORRETA
                $imageName = 'fotos_perfil/user_' . $user->id . '_' . time() . '.' . $extensao;
                
                Storage::disk('public')->put($imageName, base64_decode($file_data));

                $baseUrl = env('APP_URL', 'http://localhost:8000'); // Pega a URL do .env ou usa um padrão
                $urlImagem = $baseUrl . '/storage/' . $imageName;
                $user->foto_perfil = $urlImagem;

            } catch (\Exception $e) {
                return response()->json(['message' => 'Erro ao processar a nova imagem.'], 500);
            }
        } else {
            // Se a imagem enviada for nula, define o campo no banco de dados como nulo
            $user->foto_perfil = null;
        }

        $user->save();
        $user->refresh();
        return response()->json($user);
    }

    public function changePassword(Request $request)
    {
        $this->validate($request, [
            'senha_atual'     => 'required|string',
            'nova_senha'      => 'required|string|min:8',
            'confirmar_senha' => 'required|string|same:nova_senha'
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();

        if (!Hash::check($request->input('senha_atual'), $user->password)) {
            return response()->json(['message' => 'A senha atual está incorreta.'], 422);
        }

        $user->password = Hash::make($request->input('nova_senha'));
        $user->save(); 

        return response()->json(['message' => 'Senha alterada com sucesso!']);
    }

    public function deleteAccount()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();

        $user->delete();

        return response()->json(['message' => 'Sua conta foi excluída com sucesso.'], 200);
    }

    public function allUsers()
    {
        return response()->json(['users' => User::all()], 200);
    }

    public function singleUser($id)
    {
        try {
            $user = User::findOrFail($id);
            return response()->json(['user' => $user], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'User not found!'], 404);
        }
    }
}
