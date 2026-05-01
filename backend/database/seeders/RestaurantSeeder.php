<?php

namespace Database\Seeders;

use App\Models\Restaurant;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    public function run()
    {
        $vendor = User::where('role', 'vendor')->first();
        $categories = Category::all();

        $abujaRestaurants = [
            [
                'name' => 'The Nile Restaurant',
                'description' => 'Authentic Nigerian cuisine with a modern twist. Experience the best of Abuja\'s culinary scene.',
                'address' => '123 Ahmadu Bello Way',
                'latitude' => 9.0765,
                'longitude' => 7.3986,
                'categories' => ['Nigerian', 'Fine Dining'],
            ],
            [
                'name' => 'China Palace',
                'description' => 'Best Chinese food in Abuja. Fresh ingredients, authentic recipes, and excellent service.',
                'address' => '45 Adetokunbo Ademola Crescent',
                'latitude' => 9.0623,
                'longitude' => 7.4896,
                'categories' => ['Chinese', 'Fast Food'],
            ],
            [
                'name' => 'Fast Bites',
                'description' => 'Quick and delicious fast food. Perfect for lunch breaks and casual dining.',
                'address' => '78 Garki Area 11',
                'latitude' => 9.0234,
                'longitude' => 7.4892,
                'categories' => ['Fast Food', 'Grill'],
            ],
            [
                'name' => 'Italian Delight',
                'description' => 'Authentic Italian pasta, pizza, and more. Cozy atmosphere perfect for dates.',
                'address' => '22 Murtala Mohammed Expressway',
                'latitude' => 9.0889,
                'longitude' => 7.4982,
                'categories' => ['Italian', 'Fine Dining'],
            ],
            [
                'name' => 'Seafood Haven',
                'description' => 'Fresh seafood from Nigerian waters. Grilled, fried, or in rich pepper sauce.',
                'address' => '56 Wuse Zone 5',
                'latitude' => 9.0820,
                'longitude' => 7.4910,
                'categories' => ['Seafood', 'Grill'],
            ],
            [
                'name' => 'Green Leaf Cafe',
                'description' => 'Healthy vegetarian options and fresh smoothies. Organic ingredients guaranteed.',
                'address' => '12 Apo Resettlement',
                'latitude' => 8.9872,
                'longitude' => 7.5435,
                'categories' => ['Vegetarian', 'Coffee Shop'],
            ],
            [
                'name' => 'Bread & Butter Bakery',
                'description' => 'Fresh bread, pastries, and cakes baked daily. Also serves breakfast.',
                'address' => '89 Abuja Mall, Wuse 2',
                'latitude' => 9.0805,
                'longitude' => 7.4978,
                'categories' => ['Bakery', 'Coffee Shop'],
            ],
            [
                'name' => 'Grill Masters',
                'description' => 'Specializing in suya, grilled chicken, and barbecue. Open late nights.',
                'address' => '34 Jabi District',
                'latitude' => 9.0522,
                'longitude' => 7.4412,
                'categories' => ['Grill', 'Fast Food'],
            ],
            [
                'name' => 'Spice Route',
                'description' => 'Indian and Nigerian fusion cuisine. Bold flavors and unique combinations.',
                'address' => '67 Utako District',
                'latitude' => 9.0335,
                'longitude' => 7.4598,
                'categories' => ['Nigerian', 'Fine Dining'],
            ],
            [
                'name' => 'Coffee Central',
                'description' => 'Premium coffee, pastries, and light meals. Free WiFi and cozy seating.',
                'address' => '25 Central Business District',
                'latitude' => 9.0456,
                'longitude' => 7.4374,
                'categories' => ['Coffee Shop', 'Bakery'],
            ],
        ];

        foreach ($abujaRestaurants as $restaurantData) {
            $restaurant = Restaurant::create([
                'user_id' => $vendor->id,
                'name' => $restaurantData['name'],
                'description' => $restaurantData['description'],
                'address' => $restaurantData['address'],
                'city' => 'Abuja',
                'latitude' => $restaurantData['latitude'],
                'longitude' => $restaurantData['longitude'],
                'image' => null,
            ]);

            $categoryIds = [];
            foreach ($restaurantData['categories'] as $catName) {
                $category = Category::where('name', $catName)->first();
                if ($category) {
                    $categoryIds[] = $category->id;
                }
            }
            $restaurant->categories()->sync($categoryIds);
        }
    }
}
