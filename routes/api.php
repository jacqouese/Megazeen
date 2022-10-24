<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SoldController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\VariantsController;
use App\Http\Controllers\CollectionsController;
use App\Http\Controllers\ProductsController;
use App\Http\Controllers\StatsController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserDetailsController;
use App\Http\Controllers\ShippingOptionsController;
use App\Http\Controllers\ReturnsController;
use Illuminate\Support\Facades\Auth;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/tokens/create', function (Request $request) {
    $token = $request->user()->createToken($request->token_name);

    return ['token' => $token->plainTextToken];
});

Route::group(['middleware' => ['auth:sanctum']], function () {

    Route::get('/sold', [SoldController::class, 'index']);
    Route::get('/sold/search/{query}', [SoldController::class, 'search']);
    Route::get('/sold/byid/{id}', [SoldController::class, 'show']);
    Route::get('/sold/{date}/{invoice?}', [SoldController::class, 'indexByDate']);
    Route::get('/sold/requestLastItemByNameVariant/{name}/{variant}', [SoldController::class, 'requestLastItemByNameVariant']);
    Route::post('/sold', [SoldController::class, 'store']);
    Route::put('/sold/{id}', [SoldController::class, 'update']);
    Route::post('/sold/{id}', [SoldController::class, 'create']);
    Route::delete('/sold/{id}', [SoldController::class, 'delete']);
    Route::delete('/sold/cancel/{id}', [SoldController::class, 'cancelSale']);

    Route::get('/stats/profit/{from}/{to}', [StatsController::class, 'getProfit']);
    Route::get('/stats/profit/year', [StatsController::class, 'getProfitForYear']);
    Route::get('/stats/bestperforming/{from}/{to}', [StatsController::class, 'getBestPerforming']);

    Route::get('/warehouse', [WarehouseController::class, 'index']);
    Route::get('/warehouse/potentialprofit', [WarehouseController::class, 'potentialProfit']);
    Route::get('/warehouse/{id}', [WarehouseController::class, 'show']);
    Route::post('/warehouse', [WarehouseController::class, 'store']);
    Route::put('/warehouse/{id}', [WarehouseController::class, 'update']);
    Route::delete('/warehouse/{id}', [WarehouseController::class, 'delete']);
    Route::get('/warehouse/search/{name}/{variant}', [WarehouseController::class, 'search']);

    Route::get('/products', [ProductsController::class, 'index']);
    Route::get('/products/withvariants', [ProductsController::class, 'indexWithVariants']);
    Route::get('/products/withquantity', [ProductsController::class, 'indexWithQuantity']);
    Route::post('/products', [ProductsController::class, 'store']);
    Route::put('/products/{id}', [ProductsController::class, 'update']);
    Route::delete('/products/{id}', [ProductsController::class, 'delete']);
    
    Route::post('/variants', [VariantsController::class, 'store']);
    Route::delete('/variants/{id}', [VariantsController::class, 'delete']);


    Route::get('/collections', [CollectionsController::class, 'index']);
    Route::get('/collections/withproducts', [CollectionsController::class, 'indexWithProducts']);
    Route::post('/collections', [CollectionsController::class, 'store']);
    Route::put('/collections/{id}', [CollectionsController::class, 'update']);
    Route::post('/collections/{id}', [CollectionsController::class, 'create']);
    Route::delete('/collections/{id}', [CollectionsController::class, 'delete']);

    Route::get('/returns', [ReturnsController::class, 'index']);
    Route::get('/returns/search/{query}', [ReturnsController::class, 'search']);
    Route::get('/returns/numberof/{from}/{to}', [ReturnsController::class, 'numberOfReturnsBetweenDates']);
    Route::post('/returns', [ReturnsController::class, 'store']);
    Route::post('/returns/returntosold', [ReturnsController::class, 'returnToSold']);

    Route::get('/shippingoptions', [ShippingOptionsController::class, 'index']);
    Route::post('/shippingoptions', [ShippingOptionsController::class, 'store']);
    Route::delete('/shippingoptions/{id}', [ShippingOptionsController::class, 'delete']);

    Route::get('/user/details/general', [UserDetailsController::class, 'getUserDetails']);
    Route::get('/user/details/fees', [UserDetailsController::class, 'getUserFees']);
    Route::put('/user/details/fees', [UserDetailsController::class, 'update']);

    Route::get('/test', function (Request $request) {
        return response()->json(['message'=>Auth::user()->id]); 
    });

    Route::put('/user', [UserController::class, 'update']);
    Route::put('/user/password', [UserController::class, 'updatePassword']);
    Route::post('/logout', [UserController::class, 'logout']);
});

Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);


Route::get('/variants/image/{name}/{variant}', [VariantsController::class, 'serveImage']);
Route::get('/soldtest', [SoldController::class, 'soldTest']);