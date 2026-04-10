<?php

use App\Http\Controllers\Api\Admin\BookingAdminController;
use App\Http\Controllers\Api\Admin\RouteAdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\RouteController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/SignIn', [AuthController::class, 'signIn']);
    Route::post('/SignUp', [AuthController::class, 'signUp']);
    Route::post('/Refresh', [AuthController::class, 'refresh']);
    Route::post('/SignOut', [AuthController::class, 'signOut']);
});

Route::get('/routes', [RouteController::class, 'index']);
Route::get('/routes/{travelRoute}', [RouteController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/my', [BookingController::class, 'my']);

    Route::prefix('admin')->middleware('admin')->group(function () {
        Route::get('/bookings', [BookingAdminController::class, 'index']);
        Route::patch('/bookings/{booking}/status', [BookingAdminController::class, 'updateStatus']);

        Route::post('/routes', [RouteAdminController::class, 'store']);
        Route::put('/routes/{travelRoute}', [RouteAdminController::class, 'update']);
        Route::delete('/routes/{travelRoute}', [RouteAdminController::class, 'destroy']);
    });
});
