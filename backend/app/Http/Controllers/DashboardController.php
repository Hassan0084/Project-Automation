<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $allOrders = Order::all();

        $totalOrders = $allOrders->count();
        $cancelledOrders = $allOrders->where('is_cancelled', true)->count();
        $activeOrders = $totalOrders - $cancelledOrders;

        $losCompleted = $allOrders->where('is_cancelled', false)->where('los_status', 'CLOS')->count();

        $inProcessInstalling = Order::where('is_cancelled', false)
            ->where(function ($q) {
                $q->where('order_status', 'LIKE', '%Under MW Installation%')
                  ->orWhere('order_status', 'In Process');
            })->count();

        $awaitingTwalApproval = $allOrders->where('is_cancelled', false)
            ->filter(fn($o) => str_contains($o->order_status, 'TWAL'))->count();

        $brownConditionFlagged = $allOrders->where('is_cancelled', false)
            ->filter(fn($o) => str_contains($o->order_status, 'Brown Condition'))->count();

        $statusNotYetSet = $allOrders->where('is_cancelled', false)
            ->filter(fn($o) => empty($o->order_status) || $o.order_status === 'Not Yet Set')->count();

        $delivered = $allOrders->where('is_cancelled', false)
            ->filter(fn($o) => str_starts_with($o->order_status, 'Delivered'))->count();

        $stcOrders = $allOrders->filter(fn($o) => str_contains($o->ki_id, 'STC'))->count();
        $mobilyOrders = $allOrders->filter(fn($o) => str_contains($o->ki_id, 'Mobily'))->count();

        $regionBreakdown = Order::where('is_cancelled', false)
            ->select('region', DB::raw('count(*) as count'))
            ->groupBy('region')
            ->pluck('count', 'region');

        $cityBreakdown = Order::where('is_cancelled', false)
            ->select('city', DB::raw('count(*) as count'))
            ->groupBy('city')
            ->pluck('count', 'city');

        $bwBreakdown = Order::where('is_cancelled', false)
            ->select('bw', DB::raw('count(*) as count'))
            ->groupBy('bw')
            ->pluck('count', 'bw');

        return response()->json([
            'total_orders' => $totalOrders,
            'active_orders' => $activeOrders,
            'cancelled_orders' => $cancelledOrders,
            'los_completed' => $losCompleted,
            'in_process_installing' => $inProcessInstalling,
            'awaiting_twal_approval' => $awaitingTwalApproval,
            'brown_condition_flagged' => $brownConditionFlagged,
            'status_not_yet_set' => $statusNotYetSet,
            'delivered' => $delivered,
            'stc_orders' => $stcOrders,
            'mobily_orders' => $mobilyOrders,
            'region_breakdown' => $regionBreakdown,
            'city_breakdown' => $cityBreakdown,
            'bw_breakdown' => $bwBreakdown,
        ]);
    }
}
