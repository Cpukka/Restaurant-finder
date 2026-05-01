<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\RestaurantController;
use App\Http\Controllers\API\ReviewController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\SearchController;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{restaurant}', [RestaurantController::class, 'show']);
Route::get('/restaurants/{restaurant}/reviews', [ReviewController::class, 'index']);
Route::get('/health', function() {
    return response()->json(['status' => 'ok', 'message' => 'API is working']);
});
// Search routes
Route::get('/search', [SearchController::class, 'search']);
Route::get('/search/suggestions', [SearchController::class, 'suggestions']);
Route::get('/search/nearby', [SearchController::class, 'nearby']);
Route::get('/search/filters', [SearchController::class, 'filters']);
Route::get('/search/quick', [SearchController::class, 'quick']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Restaurant management
    Route::post('/restaurants', [RestaurantController::class, 'store']);
    Route::put('/restaurants/{restaurant}', [RestaurantController::class, 'update']);
    Route::delete('/restaurants/{restaurant}', [RestaurantController::class, 'destroy']);

    // Reviews
    Route::post('/restaurants/{restaurant}/reviews', [ReviewController::class, 'store']);
});
