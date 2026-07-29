<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DashboardController;

Route::prefix('v1')->group(function () {
    // Orders REST API
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}', [OrderController::class, 'update']);
    Route::post('/orders/bulk-status', [OrderController::class, 'bulkUpdateStatus']);

    // Dashboard REST API
    Route::get('/dashboard/summary', [DashboardController::class, 'index']);
});
