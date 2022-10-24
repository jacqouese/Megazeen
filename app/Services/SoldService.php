<?php

namespace App\Services;

class SoldService
{   

    function __construct($userFees) {
        $this->standard = $userFees['standard_fee'];
        $this->featured = $userFees['featured_fee'];
        $this->sale = $userFees['sale_fee'];
        $this->taxRate = $userFees['tax_rate'];

        $this->VAT_RATE = 0.23;
    }

    public function calculateProfit($soldItem, $warehouseItem) {
        $vatConst = $this->VAT_RATE + 1;
        $price = $soldItem['PriceSold'];
        $boughtFor = $warehouseItem['UnitPrice'];
        $isFeatured = $soldItem->boolean('Featured');
        $isSale = $soldItem->boolean('Sale');

        $priceNoVat = $price / $vatConst;
        $gross = $priceNoVat - $boughtFor;
        $fees = $price * $this->standard / $vatConst;
        $afterFees = $gross - $fees;


        //if user marked featured fees
        if ($isFeatured) {
            $feesFeatured = ($price * $this->standard / $vatConst) * $this->featured;

            $afterFees = $afterFees - $feesFeatured;            
        }

        //if user marked sale fees
        if ($isSale) {
            $feesSale = $price * ($this->standard * $this->sale) / $vatConst;

            $afterFees = $afterFees - $feesSale;
        }
        
        // substract income tax
        $netProfit = $afterFees - ($afterFees * $this->taxRate);

        return $netProfit;
    }

    public function dateParser($date) {
        //the passed dates should be separated by _
        $dates = explode('_', $date);

        //return null if date format is incorrect
        if (count($dates) != 2) {
            return null;
        }
        else {
            return $dates;
        }
    }

}
