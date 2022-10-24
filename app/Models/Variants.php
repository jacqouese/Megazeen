<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Variants extends Model
{
    // use HasFactory;
    protected $fillable = ['ProductID', 'UserID', 'VariantName', 'VariantImg'];
    public $timestamps = false;
    protected $table = 'variants';
    protected $primaryKey = 'ID';

    
    public function product() {
        return $this->hasOne(Products::class, 'ProductID');
    }

    public static function findVariantsForProduct($id) {
        $variant = static::where('ProductID', $id)->get();
        $variant->makeHidden(['VariantImg']);
        return $variant;
    }

}
