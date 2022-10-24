<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\UserDetails;

class UserController extends Controller
{
    public function register(Request $request) {
        $validate = $request->validate([
            'name' => 'required|string|max:50',
            'email' => 'required|string|unique:users,email',
            'password' => 'required|string|confirmed|min:8',
        ]);

        $user = User::create([
            'name' => $validate['name'],
            'email' => $validate['email'],
            'password' => bcrypt($validate['password']),
        ]);

        UserDetails::create([
            'users_id' => $user->id,
            'standard_fee' => 0.065,
            'featured_fee' => 0.750,
            'sale_fee' => 0.600,
            'tax_rate' => 0.120
        ]);


        return response()->json([
            'message'=>'Signed up successfully',
            'user' => $user
        ], 204); 
    }

    public function login(Request $request) {
        $validate = $request->validate([
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        if (Auth::attempt($validate)) {
            $request->session()->regenerate();

            return response()->json([
                'message'=>'Logged in successfully',
            ]); 
        }

        return response()->json([
            'message'=>'Incorrect credentials',
        ], 403); 
            
       
    }

    public function logout(Request $request) {

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function update(Request $request) {
        $validate = $request->validate([
            'name' => 'string',
            'email' => 'string|unique:users,email',
        ]);

        $user = User::findOrFail(Auth::user()->id);

        $user->update($request->all());
        return $user;
    }

    public function updatePassword(Request $request) {
        $validate = $request->validate([
            'password' => 'required|string',
            'new_password' => 'required|string|min:8'
        ]);

        $user = User::findOrFail(Auth::user()->id);

        if (Hash::check($validate['password'], $user['password'])) {
            $user->update(['password' => bcrypt($validate['new_password'])]);

            return response()->json([
                'message'=>'Password changed successfully',
            ]); 
        }

        return response()->json([
            'message'=>'Something went wrong',
        ], 400);
    }
}
