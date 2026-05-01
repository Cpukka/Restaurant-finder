<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\StoreReviewRequest;
use App\Models\Restaurant;
use App\Services\ReviewService;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    protected $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
    }

    public function store(StoreReviewRequest $request, Restaurant $restaurant)
    {
        $review = $this->reviewService->createReview(
            $request->user()->id,
            $restaurant->id,
            $request->validated()
        );

        return response()->json($review->load('user'), 201);
    }

    public function index(Restaurant $restaurant, Request $request)
    {
        $reviews = $this->reviewService->getRestaurantReviews($restaurant->id, $request->per_page ?? 10);

        return response()->json($reviews);
    }
}
