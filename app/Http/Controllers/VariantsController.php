<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\Variants;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response as SResponse;
use Image;



class VariantsController extends Controller
{
    public function index() {
        return Variants::where('UserID', Auth::user()->id)->get();
    }

    public function store(Request $request) {
        $request->validate([
            'ProductID' => 'required',
            'VariantName' => 'required',
            'VariantImage' => 'image|mimes:jpeg,png,jpg,svg|max:2048'
        ]);

        if ($request->has('VariantImage')) {
            $file = $request->file('VariantImage');
            $imageType = $file->getClientOriginalExtension();
            $image_resize = Image::make($file)->resize( null, 60, function ( $constraint ) {
                $constraint->aspectRatio();
            })->encode( 'data-url' );
            $request->merge([ 'VariantImg' => explode(',', $image_resize)[1] ]);
        }

        $request->except('VariantImage');
        
        $request->merge([ 'UserID' => Auth::user()->id ]);
        $variants = Variants::create($request->all());
        return response()->json(['message'=>'created successfully',
        'variants' => $variants]);
    }

    public function delete(Request $request, $id) {
        $variant = Variants::where('UserID', Auth::user()->id)->findOrFail($id); 
        $variant->delete();

        return response()->json([
            'message'=>'Deleted successfully',
            'type'=>'success',
        ]);
    }

    public function serveImage(Request $request, $name, $variant) {
        $variant = Variants::where('VariantName', $variant)->where('ProductName', $name)->join('products', 'variants.ProductID', 'products.ID')->first();

        if (!$variant) {
            $path = public_path().'/images/no-img.png';
            $image = file_get_contents($path);
            return response($image)->header('Content-Type', 'image/png');
        }

        $image = base64_decode($variant->VariantImg);


        if ($image === null) {
            $path = public_path().'/images/no-img.png';
            $image = file_get_contents($path);
            return response($image)->header('Content-Type', 'image/png');
        }

        return response($image)->header('Content-Type', 'image/png');
    }
}
