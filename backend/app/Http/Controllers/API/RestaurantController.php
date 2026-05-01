<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Restaurant\StoreRestaurantRequest;
use App\Http\Requests\Restaurant\UpdateRestaurantRequest;
use App\Models\Restaurant;
use App\Services\RestaurantService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class RestaurantController extends Controller
{
    protected $restaurantService;

    public function __construct(RestaurantService $restaurantService)
    {
        $this->restaurantService = $restaurantService;
    }

    public function index(Request $request)
    {
        $restaurants = $this->restaurantService->getRestaurantsWithFilters($request);
        
        // Add full image URLs to each restaurant
        $restaurants->getCollection()->transform(function ($restaurant) {
            if ($restaurant->image) {
                $restaurant->image_url = asset('storage/' . $restaurant->image);
            }
            return $restaurant;
        });

        return response()->json($restaurants);
    }

    public function store(StoreRestaurantRequest $request)
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('image')) {
                $file = $request->file('image');
                // Generate unique filename
                $filename = time() . '_' . Str::random(20) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('restaurants', $filename, 'public');
                $data['image'] = $path;
            }

            $restaurant = $this->restaurantService->createRestaurant($data, $request->user()->id);
            
            // Add image URL to response
            if ($restaurant->image) {
                $restaurant->image_url = asset('storage/' . $restaurant->image);
            }

            return response()->json($restaurant, 201);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create restaurant: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(Restaurant $restaurant)
    {
        $restaurant->load(['owner', 'categories', 'reviews.user']);
        
        // Add full image URL
        if ($restaurant->image) {
            $restaurant->image_url = asset('storage/' . $restaurant->image);
        }
        
        return response()->json($restaurant);
    }

    public function update(UpdateRestaurantRequest $request, Restaurant $restaurant)
    {
        try {
            $data = $request->validated();

            if ($request->hasFile('image')) {
                // Delete old image if exists
                if ($restaurant->image && Storage::disk('public')->exists($restaurant->image)) {
                    Storage::disk('public')->delete($restaurant->image);
                }
                
                $file = $request->file('image');
                // Generate unique filename
                $filename = time() . '_' . Str::random(20) . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('restaurants', $filename, 'public');
                $data['image'] = $path;
            }

            $restaurant = $this->restaurantService->updateRestaurant($restaurant, $data);
            
            // Add image URL to response
            if ($restaurant->image) {
                $restaurant->image_url = asset('storage/' . $restaurant->image);
            }

            return response()->json($restaurant);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update restaurant: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(Restaurant $restaurant)
    {
        try {
            // Delete image file if exists
            if ($restaurant->image && Storage::disk('public')->exists($restaurant->image)) {
                Storage::disk('public')->delete($restaurant->image);
            }
            
            $this->restaurantService->deleteRestaurant($restaurant);
            
            return response()->json(['message' => 'Restaurant deleted successfully'], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete restaurant: ' . $e->getMessage()
            ], 500);
        }
    }
}