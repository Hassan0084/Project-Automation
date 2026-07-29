<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['activities', 'documents']);

        if ($request->has('region') && $request->region !== 'ALL') {
            $query->where('region', $request->region);
        }

        if ($request->has('city') && $request->city !== 'ALL') {
            $query->where('city', $request->city);
        }

        if ($request->has('bw') && $request->bw !== 'ALL') {
            $query->where('bw', $request->bw);
        }

        if ($request->has('status') && $request->status !== 'ALL') {
            if ($request->status === 'Active') {
                $query->where('is_cancelled', false);
            } elseif ($request->status === 'Cancelled') {
                $query->where('is_cancelled', true);
            } else {
                $query->where('order_status', 'LIKE', '%' . $request->status . '%');
            }
        }

        return response()->json($query->orderBy('id', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ki_id' => 'required|unique:orders,ki_id',
            'customer_name' => 'required|string',
            'order_number' => 'required|string',
            'region' => 'nullable|string',
            'city' => 'nullable|string',
            'circuit_id' => 'nullable|string',
            'bw' => 'nullable|string',
            'order_status' => 'nullable|string',
            'assigned_to' => 'nullable|string'
        ]);

        $order = Order::create($validated);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order
        ], 201);
    }

    public function show($id)
    {
        $order = Order::with(['activities', 'documents'])->findOrFail($id);
        return response()->json($order);
    }

    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $order->update($request->all());

        return response()->json([
            'message' => 'Order updated successfully',
            'order' => $order
        ]);
    }

    public function bulkUpdateStatus(Request $request)
    {
        $request->validate([
            'order_ids' => 'required|array',
            'order_status' => 'required|string'
        ]);

        Order::whereIn('id', $request->order_ids)->update([
            'order_status' => $request->order_status,
            'updated_at' => now()
        ]);

        return response()->json(['message' => 'Bulk status updated successfully']);
    }
}
