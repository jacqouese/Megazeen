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

class StatsController extends Controller
{

    public function getProfit(Request $request) {
        $profit = Sold::where('UserID', Auth::user()->id)
                                    ->whereNull('returned_at')
                                    ->where('DateSold', '>=', $request->from)
                                    ->where('DateSold', '<=', $request->to)
                                    ->select(
                                        DB::raw('SUM(`Profit`) as profit_sum'), 
                                        DB::raw('SUM(`PriceSold`) as turnover'), 
                                        DB::raw('COUNT(`ID`) as numberof'
                                    ))->get();
        
        if ($profit[0]['profit_sum'] === null) {
            $profit[0]['profit_sum'] = 0;
        }
        if ($profit[0]['turnover'] === null) {
            $profit[0]['turnover'] = 0;
        }

        return response()->json(['message'=>'success',
        'profit' => $profit[0]['profit_sum'],
        'turnover' => $profit[0]['turnover'],
        'number' => $profit[0]['numberof'],
        ]);
    }

    public function getProfitForYear(Request $request) {
        $months = [];
        $data = [];
        $month = date('m');
        $year = date('Y');

        for ($i=$month-11; $i <= $month ; $i++) {
            $innerMonth = $i;
            $innerYear = $year;
            if ($i <= 0) {
                $innerMonth = 12 - abs($i);
                $innerYear = $year - 1;
            }
            

            $result = Sold::where('UserID', Auth::user()->id)
                                    ->whereNull('returned_at')
                                    ->where(DB::raw('Year(DateSold)'), '=', $innerYear)
                                    ->where(DB::raw('Month(DateSold)'), '=', $innerMonth)
                                    ->select(
                                        DB::raw("SUM(Profit) as ProfitSum"), 
                                        DB::raw("SUM(PriceSold) as Turnover"),
                                        DB::raw("Count(ID) as numberof",
                                    ))->get();

            array_push($data, ...$result);
            array_push($months, $innerMonth);
        }

        return [$months, $data];
    }

    public function getBestPerforming(Request $request) {
        $profit = Sold::where('UserID', Auth::user()->id)
                                    ->whereNull('returned_at')
                                    ->where('DateSold', '>=', $request->from)
                                    ->where('DateSold', '<=', $request->to)
                                    ->select(
                                        'ProductName',
                                        DB::raw('SUM(`Profit`) as profit_sum'), 
                                        DB::raw('COUNT(`ID`) as numberof'
                                    ))
                                    ->groupBy('ProductName')
                                    ->orderBy('profit_sum', 'desc')
                                    ->take(6)
                                    ->get();


        return $profit;
    }
}
