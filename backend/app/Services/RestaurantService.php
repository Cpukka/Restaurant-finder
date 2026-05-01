<?php

namespace App\Services;

use App\Models\Restaurant;
use App\Models\Category;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;

class RestaurantService
{
    public function createRestaurant(array $data, $userId)
    {
        $restaurant = Restaurant::create([
            'user_id' => $userId,
            'name' => $data['name'],
            'description' => $data['description'],
            'address' => $data['address'],
            'city' => $data['city'],
            'latitude' => $data['latitude'],
            'longitude' => $data['longitude'],
            'image' => $data['image'] ?? null,
        ]);

        if (isset($data['categories'])) {
            $restaurant->categories()->sync($data['categories']);
        }

        return $restaurant->load('categories');
    }

    public function updateRestaurant(Restaurant $restaurant, array $data)
    {
        if (isset($data['image']) && $restaurant->image) {
            Storage::disk('public')->delete($restaurant->image);
        }

        $restaurant->update($data);

        if (isset($data['categories'])) {
            $restaurant->categories()->sync($data['categories']);
        }

        return $restaurant->load('categories');
    }

    public function deleteRestaurant(Restaurant $restaurant)
    {
        if ($restaurant->image) {
            Storage::disk('public')->delete($restaurant->image);
        }
        return $restaurant->delete();
    }

    public function getRestaurantsWithFilters($request)
    {
        $query = Restaurant::with(['owner', 'categories', 'reviews']);

        if ($request->has('search')) {
            $query->where(function(Builder $q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->has('category')) {
            $query->whereHas('categories', function(Builder $q) use ($request) {
                $q->where('categories.id', $request->category);
            });
        }

        if ($request->has('latitude') && $request->has('longitude')) {
            $this->applyDistanceFilter($query, $request->latitude, $request->longitude, $request->radius ?? 10);
        }

        return $query->paginate($request->per_page ?? 15);
    }

    private function applyDistanceFilter($query, $lat, $lng, $radius)
    {
        $haversine = "(6371 * acos(cos(radians($lat))
            * cos(radians(latitude))
            * cos(radians(longitude) - radians($lng))
            + sin(radians($lat))
            * sin(radians(latitude))))";

        return $query->select('*')
            ->selectRaw("{$haversine} AS distance")
            ->having('distance', '<=', $radius)
            ->orderBy('distance');
    }
}
