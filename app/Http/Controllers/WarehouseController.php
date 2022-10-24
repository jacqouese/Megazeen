<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Warehouse;
use App\Models\Sold;

use Illuminate\Support\Facades\Auth;

class WarehouseController extends Controller
{
    public function index() {
        return Warehouse::where('UserID', Auth::user()->id);
    }

    public function store(Request $request) {
        $request->validate([
            'ProductName' => 'required',
            'ProductVariant' => 'required',
            'CollectionID' => 'required',
        ]);

        $request->merge([ 'UserID' => Auth::user()->id ]);
        $warehouse = Warehouse::create($request->all());
        
        return response()->json(['message'=>'201',
        'warehouse' => $warehouse]);
    }

    public function show($id) {
        $warehouse = Warehouse::where('UserID', Auth::user()->id)->find($id);

        if ($warehouse === null) {
            return response()->json(['message'=>'404']);
        }

        return $warehouse;
    }

    public function update(Request $request, $id) {
        $product = Warehouse::where('UserID', Auth::user()->id)->findOrFail($id);
        $product->update($request->all());
        return $product;
    }

    public function delete($id) {
        $warehouse = Warehouse::where('UserID', Auth::user()->id)->findOrFail($id);
        $warehouse->delete();

        return response()->json(['message'=>'200']);
    }

    public function potentialProfit() {
        $items = Warehouse::all();

        $potentialProfit = 0;

        foreach ($items as $item) {
            $soldItem = Sold::where('ProductName', $item['ProductName'])->where('ProductVariant', $item['ProductVariant'])->get();

            if (isset($soldItem[0])) {
                $potentialProfit = $potentialProfit + $soldItem[0]['PriceSold'] * $item['Quantity'];
            }
           
        }

        return response()->json(['message' => 'success', 'potentialProfit' => $potentialProfit]);
    }
}
