<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Sold;
use App\Models\Warehouse;
use App\Models\UserDetails;
use App\Http\Controllers\WarehouseController;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReturnsController extends Controller
{

    public function index() {
        return Sold::where('UserID', Auth::user()->id)->whereNotNull('returned_at')->orderBy('DateSold', 'desc')->orderBy('ID', 'desc')->paginate(20);
    }

    public function store(Request $request) {
        $validate = Validator::make($request->all(), [
            'id' => 'required',
            'returned_at' => 'required|date'
        ]);
        
        $toReturn = Sold::where('UserID', Auth::user()->id)
                                    ->whereNull('returned_at')
                                    ->findOrFail($request->id)
                                    ->update(['returned_at' => $request->returned_at]);

        return response()->json(['message'=>'created successfully',
        'return' => $toReturn]);
    }

    public function search($query) {
        return Sold::where('UserID', Auth::user()->id)
                                    ->whereNotNull('returned_at')
                                    ->where('Buyer', 'like', '%'.$query.'%')
                                    ->orWhere(DB::raw('concat(ProductName," ",ProductVariant)') , 'LIKE' , '%'.$query.'%')
                                    ->orderBy('DateSold', 'desc')->orderBy('ID', 'desc')
                                    ->paginate(20);
    }


    public function returnToSold(Request $request) {
        $validate = Validator::make($request->all(), [
            'id' => 'required'
        ]);
        
        $toReturn = Sold::where('UserID', Auth::user()->id)->whereNotNull('returned_at')->findOrFail($request->id);
        $toReturn->update(['returned_at' => null]);

        return response()->json(['message'=>'moved back successfully',
        'return' => $toReturn]);
    }

    public function numberOfReturnsBetweenDates(Request $request) {
        $validate = Validator::make($request->all(), [
            'from' => 'required|date',
            'to' => 'required|date',
        ]);

        return Sold::where('UserID', Auth::user()->id)->whereNotNull('returned_at')->whereBetween(DB::raw('DATE(`returned_at`)'), [$request->from, $request->to])->count();
    }

}
