'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import RatingStars from '../../components/RatingStars';
import useRestaurants from '../../hooks/useRestaurants';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RestaurantDetailPage() {
  const { id } = useParams();
  const { getRestaurant, submitReview, fetchReviews } = useRestaurants();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadRestaurant();
    loadReviews();
  }, [id]);

  const loadRestaurant = async () => {
    try {
      const data = await getRestaurant(parseInt(id as string));
      setRestaurant(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await fetchReviews(parseInt(id as string));
      setReviews(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to leave a review');
      return;
    }

    setSubmitting(true);
    try {
      await submitReview(parseInt(id as string), rating, comment);
      toast.success('Review submitted successfully!');
      setComment('');
      setRating(5);
      await loadReviews();
      await loadRestaurant();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Restaurant not found</p>
      </div>
    );
  }

  const averageRating = restaurant.reviews?.length
    ? restaurant.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / restaurant.reviews.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Restaurant Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="relative h-96">
          {restaurant.image ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${restaurant.image}`}
              alt={restaurant.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center">
              <span className="text-white text-6xl font-bold">
                {restaurant.name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {restaurant.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-4">
            <RatingStars rating={averageRating} size="large" />
            <span className="text-gray-600 dark:text-gray-400">
              ({restaurant.reviews?.length || 0} reviews)
            </span>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            {restaurant.description}
          </p>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{restaurant.address}, {restaurant.city}</span>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Customer Reviews
          </h2>
          
          {reviews.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {review.user?.name}
                    </span>
                    <RatingStars rating={review.rating} size="small" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Write Review Form */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-20">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Write a Review
            </h3>
            
            {user ? (
              <form onSubmit={handleSubmitReview}>
                <div className="mb-4">
                  <label className="label">Rating</label>
                  <RatingStars 
                    rating={rating} 
                    size="large" 
                    interactive={true}
                    onRatingChange={setRating}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="label">Your Review</label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className="input"
                    placeholder="Share your experience..."
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Please <a href="/login" className="text-primary-600">login</a> to leave a review
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}