<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Collections;
use App\Models\Warehouse;

use Illuminate\Support\Facades\Auth;

class CollectionsController extends Controller
{
    public function index() {
        return Collections::where('UserID', '=', Auth::user()->id);
    }

    public function indexWithProducts() {
        $collections = Collections::where('UserID', '=', Auth::user()->id)->get();

        foreach ($collections as $collection) {
            $collection['Products'] = $this->searchWarehouseByID($collection['ID']);
        }

        return $collections;

    }

    public function store(Request $request) {
        $request->validate([
            'PriceTotal' => 'required',
            'DateBought' => 'required', 
        ]);

        $request->merge([ 'UserID' => Auth::user()->id ]);
        $collection = Collections::create($request->all());
        
        return response()->json(['message'=>'created successfully',
        'collection' => $collection]);
    }

    public function delete($id) {
        $collection = Collections::where('UserID', Auth::user()->id)->findOrFail($id);
        $collection->delete();
        
        return response()->json(['message'=>'200']);
    }

    private function searchWarehouseByID($id) {
        return Warehouse::where('CollectionID', $id)->get();
    }
    
}
