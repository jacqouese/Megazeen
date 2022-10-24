<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Support\Facades\Auth;

class UserDetails extends Model
{
    // use HasFactory;
    protected $fillable = ['users_id', 'standard_fee', 'featured_fee', 'sale_fee', 'tax_rate'];
    public $timestamps = false;
    protected $table = 'users_details';

    public static function getUserFees() {
        return static::where('users_id', Auth::user()->id)->firstOrFail();
    }
}
