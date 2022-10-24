<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Products;
use App\Models\Warehouse;
use App\Models\Variants;
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\VariantsController;

class ProductsController extends Controller
{
    public function index() {
        return Products::all();
    }

    public function indexWithVariants() {
        $products = Products::where('UserID', Auth::user()->id)->get();

        foreach ($products as $product) {
            $product['Variants'] = Variants::findVariantsForProduct($product['ID']);
        }

        return $products;
    }

    public function indexWithQuantity() {
        $products = Warehouse::getQuantityOfWarehouseProducts(Auth::user()->id);

        return $products;
    }

    public function store(Request $request) {
        $request->validate([
            'ProductName' => 'required'
        ]);
        $request->merge([ 'UserID' => Auth::user()->id ]);

        $products = Products::create($request->all());
        return response()->json(['message'=>'created successfully',
        'products' => $products]);
    }


    public function delete(Request $request, $id) {
        $product = Products::where('UserID', Auth::user()->id)->findOrFail($id); 
        $product->delete();

        return response()->json([
            'message'=>'Deleted successfully',
            'type'=>'success',
        ]);
    }
}
