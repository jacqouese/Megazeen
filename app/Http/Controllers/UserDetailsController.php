<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\UserDetails;

class UserDetailsController extends Controller
{
    public function getUserDetails() {
        return User::where('id', Auth::user()->id)->select('name', 'email')->firstOrFail();
    }

    public function getUserFees() {
        return UserDetails::where('users_id', Auth::user()->id)->select('standard_fee', 'featured_fee', 'sale_fee', 'tax_rate')->firstOrFail();
    }

    public function update(Request $request) {
        $request->validate([
            'standard_fee' => 'numeric',
            'featured_fee' => 'numeric',
            'sale_fee' => 'numeric',
            'tax_rate' => 'numeric',
        ]);

        $user = UserDetails::where('users_id', Auth::user()->id)->first();
        $user->update($request->all());
        return $user;
    }
}
