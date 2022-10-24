<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingOptions extends Model
{
    // use HasFactory;
    protected $fillable = ['user_id', 'name', 'value'];
    public $timestamps = false;
    protected $table = 'shipping_options';
}
