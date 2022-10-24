<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Products extends Model
{
    // use HasFactory;
    protected $fillable = ['ID', 'ProductName', 'UserID'];
    public $timestamps = false;
    protected $table = 'products';
    protected $primaryKey = 'ID';
}
