'use client';

import { useEffect, useState } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import useRestaurants from '../hooks/useRestaurants';

export default function RestaurantsPage() {
  const { restaurants, loading, fetchRestaurants, filters, setFilters } = useRestaurants();

  useEffect(() => {
    fetchRestaurants();
  }, [filters, fetchRestaurants]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          All Restaurants
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover the best dining experiences in Abuja
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.data?.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          {!loading && restaurants.data?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No restaurants found.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}