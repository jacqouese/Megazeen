<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Collections extends Model
{
    // use HasFactory;
    protected $fillable = ['PriceTotal', 'DateBought', 'UserID'];
    public $timestamps = false;
    protected $table = 'collections';
    protected $primaryKey = 'ID';
}
