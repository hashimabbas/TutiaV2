<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Visitor;
use DateTime;
use Illuminate\Http\Request;

class VisitorChartController extends Controller
{
      public function getAllMonths()
    {
        $month_array = array();
        $visit_dates = Visitor::orderBy('created_at', 'ASC')->pluck('created_at');
        $visit_dates = json_decode($visit_dates);
        if(!empty($visit_dates)){
            foreach($visit_dates as $date){
                $date = new \DateTime($date);
                $month_no = $date->format('m');
                $month_name = $date->format('M');
                $month_array[$month_no] = $month_name;
            }
        }
        return $month_array;
    }

    public function getMonthlyVisistorCount($month)
    {
        $monthlyVisitorCount = Visitor::whereMonth('created_at', $month)->get()->count();
        return $monthlyVisitorCount;
    }

    public function getAllVisitsData()
    {
        $month_array = $this->getAllMonths();
        $monthlyVisitCountArray = array();
        $months_name = array();
        if(!empty($month_array)){
            foreach($month_array as $month_no => $month_name){
                $monthlyVisitCount = $this->getMonthlyVisistorCount($month_no);
                array_push($monthlyVisitCountArray, $monthlyVisitCount);
                array_push($months_name, $month_name);
            }
        }
        $month_array = $this->getAllMonths();
        $monthlyVisitDataArray = array(
            'months' => $months_name,
            'monthlyVisitCountData' => $monthlyVisitCountArray,
        );
        return $monthlyVisitDataArray;
    }

    public function getVisitorByPages()
    {
        $pagesArray = array();
        $pages = Visitor::all()->pluck('page_name');
        $pages = json_decode($pages);
        foreach($pages as $page){

            $pagesArray[] = $page;
        }
        return $pagesArray;
    }
}
