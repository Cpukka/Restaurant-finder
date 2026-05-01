<?php

namespace App\Services;

use App\Models\Review;
use App\Models\Restaurant;

class ReviewService
{
    public function createReview($userId, $restaurantId, array $data)
    {
        return Review::create([
            'user_id' => $userId,
            'restaurant_id' => $restaurantId,
            'rating' => $data['rating'],
            'comment' => $data['comment'],
        ]);
    }

    public function getRestaurantReviews($restaurantId, $perPage = 10)
    {
        return Review::with('user')
            ->where('restaurant_id', $restaurantId)
            ->latest()
            ->paginate($perPage);
    }
}
