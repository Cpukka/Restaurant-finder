<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run()
    {
        $categories = [
            'Fast Food',
            'Nigerian',
            'Chinese',
            'Italian',
            'Seafood',
            'Vegetarian',
            'Grill',
            'Bakery',
            'Coffee Shop',
            'Fine Dining',
        ];

        foreach ($categories as $category) {
            Category::create(['name' => $category]);
        }
    }
}
