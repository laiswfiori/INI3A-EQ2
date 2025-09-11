<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
        $this->validate($request, [
            'foto_perfil' => 'required|string', // Espera uma string (Base64)
        ]);
        
        $user = Auth::user();
        if (!($user instanceof User)) {
            return response()->json(['message' => 'Authentication error: Could not get user model.'], 500);
        }
        $user->foto_perfil = $request->input('foto_perfil');
        $user->save();

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
