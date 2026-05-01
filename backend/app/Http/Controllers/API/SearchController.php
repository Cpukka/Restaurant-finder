<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchController extends Controller
{
    /**
     * Advanced search with filters
     */
    public function search(Request $request)
    {
        try {
            $query = Restaurant::query()->with(['categories', 'reviews']);

            // 1. Search by name or description
            if ($request->has('q') && $request->q) {
                $searchTerm = $request->q;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('description', 'LIKE', "%{$searchTerm}%")
                      ->orWhere('address', 'LIKE', "%{$searchTerm}%");
                });
            }

            // 2. Filter by category
            if ($request->has('category') && $request->category) {
                $query->whereHas('categories', function ($q) use ($request) {
                    $q->where('name', 'LIKE', "%{$request->category}%");
                });
            }

            // 3. Filter by city
            if ($request->has('city') && $request->city && $request->city !== 'All Cities') {
                $query->where('city', 'LIKE', "%{$request->city}%");
            }

            // 4. Filter by price range (if you add price column)
            if ($request->has('min_price') && $request->min_price) {
                $query->where('avg_price', '>=', $request->min_price);
            }
            if ($request->has('max_price') && $request->max_price) {
                $query->where('avg_price', '<=', $request->max_price);
            }

            // 5. Filter by rating
            if ($request->has('min_rating') && $request->min_rating) {
                $query->havingRaw('AVG(reviews.rating) >= ?', [$request->min_rating]);
            }

            // 6. Distance-based search (Haversine formula)
            if ($request->has('latitude') && $request->has('longitude')) {
                $lat = $request->latitude;
                $lng = $request->longitude;
                $radius = $request->radius ?? 10; // Default 10km radius

                $haversine = "(6371 * acos(
                    cos(radians($lat)) 
                    * cos(radians(latitude)) 
                    * cos(radians(longitude) - radians($lng)) 
                    + sin(radians($lat)) 
                    * sin(radians(latitude))
                ))";

                $query->select('*')
                      ->selectRaw("{$haversine} AS distance")
                      ->having('distance', '<=', $radius)
                      ->orderBy('distance', 'asc');
            }

            // 7. Sorting options
            switch ($request->sort_by) {
                case 'rating_desc':
                    $query->withAvg('reviews', 'rating')
                          ->orderBy('reviews_avg_rating', 'desc');
                    break;
                case 'rating_asc':
                    $query->withAvg('reviews', 'rating')
                          ->orderBy('reviews_avg_rating', 'asc');
                    break;
                case 'name_asc':
                    $query->orderBy('name', 'asc');
                    break;
                case 'name_desc':
                    $query->orderBy('name', 'desc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
                case 'oldest':
                    $query->orderBy('created_at', 'asc');
                    break;
                default:
                    $query->orderBy('name', 'asc');
            }

            // 8. Pagination
            $perPage = $request->per_page ?? 12;
            $restaurants = $query->paginate($perPage);

            // Add image URLs and rating data
            $restaurants->getCollection()->transform(function ($restaurant) {
                if ($restaurant->image) {
                    $restaurant->image_url = asset('storage/' . $restaurant->image);
                }
                
                $restaurant->average_rating = $restaurant->reviews->avg('rating') ?? 0;
                $restaurant->reviews_count = $restaurant->reviews->count();
                
                return $restaurant;
            });

            return response()->json([
                'success' => true,
                'data' => $restaurants,
                'filters' => $request->all(),
                'total_results' => $restaurants->total()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get search suggestions (autocomplete)
     */
    public function suggestions(Request $request)
    {
        try {
            $query = $request->get('q', '');
            
            if (strlen($query) < 2) {
                return response()->json(['suggestions' => []]);
            }

            // Get restaurant name suggestions
            $restaurants = Restaurant::where('name', 'LIKE', "%{$query}%")
                ->limit(5)
                ->get(['id', 'name', 'city']);

            // Get category suggestions
            $categories = Category::where('name', 'LIKE', "%{$query}%")
                ->limit(3)
                ->get(['id', 'name']);

            // Get city suggestions
            $cities = Restaurant::where('city', 'LIKE', "%{$query}%")
                ->distinct()
                ->limit(3)
                ->pluck('city');

            return response()->json([
                'success' => true,
                'suggestions' => [
                    'restaurants' => $restaurants,
                    'categories' => $categories,
                    'cities' => $cities
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get nearby restaurants based on coordinates
     */
    public function nearby(Request $request)
    {
        try {
            $request->validate([
                'latitude' => 'required|numeric',
                'longitude' => 'required|numeric',
                'radius' => 'sometimes|numeric|min:1|max:50'
            ]);

            $lat = $request->latitude;
            $lng = $request->longitude;
            $radius = $request->radius ?? 5; // Default 5km

            $haversine = "(6371 * acos(
                cos(radians($lat)) 
                * cos(radians(latitude)) 
                * cos(radians(longitude) - radians($lng)) 
                + sin(radians($lat)) 
                * sin(radians(latitude))
            ))";

            $restaurants = Restaurant::select('*')
                ->selectRaw("{$haversine} AS distance")
                ->having('distance', '<=', $radius)
                ->orderBy('distance', 'asc')
                ->with(['categories', 'reviews'])
                ->paginate($request->per_page ?? 20);

            // Add image URLs and ratings
            $restaurants->getCollection()->transform(function ($restaurant) {
                if ($restaurant->image) {
                    $restaurant->image_url = asset('storage/' . $restaurant->image);
                }
                $restaurant->average_rating = $restaurant->reviews->avg('rating') ?? 0;
                return $restaurant;
            });

            return response()->json([
                'success' => true,
                'data' => $restaurants,
                'center' => ['lat' => $lat, 'lng' => $lng],
                'radius' => $radius
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Advanced filters - get available filter options
     */
    public function filters()
    {
        try {
            // Get unique cities
            $cities = Restaurant::distinct()->pluck('city');
            
            // Get all categories
            $categories = Category::all();
            
            // Get rating ranges
            $ratings = [
                ['label' => '4★ & above', 'value' => 4],
                ['label' => '3★ & above', 'value' => 3],
                ['label' => '2★ & above', 'value' => 2],
                ['label' => '1★ & above', 'value' => 1],
            ];
            
            // Get price ranges (if you have price column)
            $priceRanges = [
                ['label' => 'Budget (₦0 - ₦5,000)', 'min' => 0, 'max' => 5000],
                ['label' => 'Moderate (₦5,000 - ₦10,000)', 'min' => 5000, 'max' => 10000],
                ['label' => 'Expensive (₦10,000+)', 'min' => 10000, 'max' => null],
            ];

            return response()->json([
                'success' => true,
                'filters' => [
                    'cities' => $cities,
                    'categories' => $categories,
                    'ratings' => $ratings,
                    'price_ranges' => $priceRanges,
                    'sort_options' => [
                        ['label' => 'Name (A-Z)', 'value' => 'name_asc'],
                        ['label' => 'Name (Z-A)', 'value' => 'name_desc'],
                        ['label' => 'Highest Rated', 'value' => 'rating_desc'],
                        ['label' => 'Lowest Rated', 'value' => 'rating_asc'],
                        ['label' => 'Newest First', 'value' => 'newest'],
                        ['label' => 'Oldest First', 'value' => 'oldest'],
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Quick search - lightweight for navbar search
     */
    public function quick(Request $request)
    {
        try {
            $query = $request->get('q', '');
            
            if (empty($query)) {
                return response()->json(['data' => []]);
            }

            $restaurants = Restaurant::where('name', 'LIKE', "%{$query}%")
                ->orWhere('description', 'LIKE', "%{$query}%")
                ->limit(5)
                ->get(['id', 'name', 'city', 'image']);

            // Add image URLs
            $restaurants->transform(function ($restaurant) {
                if ($restaurant->image) {
                    $restaurant->image_url = asset('storage/' . $restaurant->image);
                }
                return $restaurant;
            });

            return response()->json([
                'success' => true,
                'data' => $restaurants
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }
}