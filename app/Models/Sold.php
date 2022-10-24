<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sold extends Model
{
    // use HasFactory;
    protected $fillable = ['UserID', 'ProductName', 'ProductVariant', 'Invoice', 'Featured', 'Sale', 'Shipping', 'PriceSold', 'PriceBought', 'Profit', 'Buyer', 'CollectionID', 'DateSold', 'returned_at'];
    protected $table = 'sales_log';
    protected $primaryKey = 'ID';
}
