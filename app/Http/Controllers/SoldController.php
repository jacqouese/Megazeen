<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Sold;
use App\Models\Variants;
use App\Models\Warehouse;
use App\Models\UserDetails;
use App\Services\SoldService;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class SoldController extends Controller
{

    public function index() {
        return Sold::where('UserID', Auth::user()->id)->whereNull('returned_at')->orderBy('DateSold', 'desc')->orderBy('sales_log.ID', 'desc')
        ->paginate(20);
    }

    public function indexByDate($date, $includeInvoice = 1) {
        $dates = explode('_', $date);
        
        if (count($dates) != 2) {
            return response()->json(['message'=>'error: make sure to input dates correctly']); 
        }

        //return a list excluding invoices or including invoices
        if ($includeInvoice == 0) {
            return Sold::where('UserID', Auth::user()->id)
                                    ->where([
                                        ['DateSold', '>=', $dates[0]],
                                        ['DateSold', '<=', $dates[1]],
                                        ['Invoice', '=', 0],
                                        ['returned_at', '=', null]

                                    ])
                                    ->orWhere([
                                        ['DateSold', '>=', $dates[0]],
                                        ['DateSold', '<=', $dates[1]],
                                        ['Invoice', '=', 0],
                                        [DB::raw('DATE(`returned_at`)') , '>', $dates[1]]
                                    ])
                                    ->orderBy('DateSold', 'asc')
                                    ->get();
        }
        else {
            return Sold::where('UserID', Auth::user()->id)
                                    ->where('DateSold', '>=', $dates[0])
                                    ->where('DateSold', '<=', $dates[1])
                                    ->whereNull('returned_at')
                                    ->orWhere(DB::raw('DATE("returned_at")') , '>', $dates[1])
                                    ->orderBy('DateSold', 'asc')
                                    ->get();
        }
    }

    public function store(Request $request) {
        $request->validate([
            'ProductName' => 'required',
            'ProductVariant' => 'required',
            'PriceSold' => 'required',
            'Buyer' => 'required'
        ]);

        $warehouseItems = Warehouse::getByNameAndVariant($request['ProductName'], $request['ProductVariant']);

        // abort if product is not avaliable in warehouse
        try {
            $warehouseItem = $warehouseItems[0];
        } catch (\Throwable $th) {
            return response()->json(['message' => 'Product not available', 'type' => 'warning'], 404);
        }

        $request->merge([ 'PriceBought' => $warehouseItem['UnitPrice'] ]);
        $request->merge([ 'CollectionID' => $warehouseItem['CollectionID'] ]);
        $request->merge([ 'UserID' => Auth::user()->id ]);

        $userSpecificFees = UserDetails::getUserFees();

        $soldService = new SoldService($userSpecificFees);
        $netProfit = $soldService->calculateProfit($request, $warehouseItem);

        $request->merge([ 'Profit' => $netProfit ]);

        try {
            $sold = Sold::create($request->all());
        } catch (\Throwable $th) {
            return response()->json([
                'message'=>$th,
                'type'=>'error'
                ]);
        }

        Warehouse::updateWarehouseQuantityById($warehouseItem['Quantity']-1, $warehouseItem['ID']);
        
        // check how many pieces are left
        $quantityLeft = -1;
        foreach ($warehouseItems as $item) {
            $quantityLeft = $quantityLeft + $item['Quantity'];
        }

        return response()->json([
            'message'=>'Added successfully',
            'type'=>'success',
            'sales_log' => $sold,
            'quantity' => $quantityLeft
            ]);
    }

    public function show(Request $request, $id) {
        return Sold::where('UserID', Auth::user()->id)->findOrFail($id);
    }

    public function search($query) {
        return Sold::where('UserID', Auth::user()->id)
                                    ->whereNull('returned_at')
                                    ->where('Buyer', 'like', '%'.$query.'%')
                                    ->orWhere(DB::raw('concat(ProductName," ",ProductVariant)') , 'LIKE' , '%'.$query.'%')
                                    ->orderBy('DateSold', 'desc')->orderBy('ID', 'desc')
                                    ->paginate(20);
    }

    public function delete(Request $request, $id) {
        $product = Sold::where('UserID', '=', Auth::user()->id)->findOrFail($id);
        $product->delete();

        return response()->json([
            'message'=>'Deleted successfully',
            'type'=>'success',
        ]);
    }

    public function update(Request $request, $id) {
        $validator = $request->validate([
            'ProductName' => 'min:3',
            'ProductVariant' => 'min:2',
            'PriceSold' => 'numeric',
            'Profit' => 'numeric',
            'Shipping' => 'numeric',
            'Buyer' => 'min:3'
        ]);

        $product = Sold::where('UserID', '=', Auth::user()->id)->findOrFail($id);
        $product->update($validator);

        return response()->json([
            'message'=>'Updated successfully',
            'type'=>'success'
        ]);
    }

    public function requestLastItemByNameVariant($name, $variant) {
        $foundItem = Sold::where('UserID', Auth::user()->id)->where('ProductName', $name)->where('ProductVariant', $variant)->orderBy('DateSold', 'desc')->first(['PriceSold','Featured','Sale']);

        if (!$foundItem) {
            return response()->json([
                'PriceSold' => 0,
                'Featured' => 0,
                'Sale' => 0,
                ]);
        }

        return $foundItem;
    }

    public function cancelSale(Request $request, $id) {
        try {
            $product = Sold::where('UserID', '=', Auth::user()->id)->findOrFail($id);
            $warehouse = Warehouse::where('CollectionID', $product->CollectionID)
                                    ->where('ProductName', $product->ProductName)
                                    ->where('ProductVariant', $product->ProductVariant)
                                    ->firstOrFail();
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response([
                'status' => 'ERROR',
                'error' => '404 not found'
            ], 404);
        }
        
        $warehouse->update(['Quantity' => $warehouse->Quantity + 1]);
        $product->delete();
        
        return response()->json([
            'message'=>'Deleted successfully',
            'type'=>'success',
            'quantity'=>$warehouse->Quantity - 1
        ]);
    }
}
