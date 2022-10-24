<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\ShippingOptions;

use Illuminate\Support\Facades\Auth;

class ShippingOptionsController extends Controller
{
    public function index() {
        return ShippingOptions::where('user_id', Auth::user()->id)->get();
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required',
            'value' => 'required',
        ]);

        $request->merge([ 'user_id' => Auth::user()->id ]);

        $shipping = ShippingOptions::create($request->all());
        return response()->json(['message'=>'created successfully',
        'shipping' => $shipping]);
    }

    public function delete(Request $request, $id) {
        $shipping = ShippingOptions::where('user_id', Auth::user()->id)->findOrFail($id);
        $shipping->delete();

        return response()->json([
            'message'=>'Deleted successfully',
            'type'=>'success',
        ]);
    }
    
}
