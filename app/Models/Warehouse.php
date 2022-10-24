<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

use Illuminate\Support\Facades\Auth;

class Warehouse extends Model
{
    // use HasFactory;
    protected $fillable = ['CollectionID', 'ProductName', 'PriceBought', 'UnitPrice', 'ProductVariant', 'DateBought', 'Quantity', 'OriginalQuantity', 'UserID'];
    public $timestamps = false;
    protected $table = 'warehouse';
    protected $primaryKey = 'ID';


    public static function getByNameAndVariant($name, $variant) {
        return static::where('ProductName', $name)->where('ProductVariant', $variant)->where('Quantity', '!=', 0)->where('UserID', Auth::user()->id)->orderBy('DateBought', 'ASC')->get();
    }

    public static function updateWarehouseQuantityById($quantity, $id) {
        $product = static::findOrFail($id);
        $product->update(['Quantity' => $quantity]);
        return $product;
    }

    public static function getQuantityOfWarehouseProducts($userId) {
        $products = DB::select("SELECT `ProductName`, `ProductVariant`, SUM(`Quantity`) as `TotalQuantity` FROM `warehouse` WHERE `UserID` = $userId GROUP BY `ProductName`, `ProductVariant`");
        return $products;
    }
}
