'use client';

import { useState, useEffect } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import SearchFilters from '../components/SearchFilters';
import useRestaurants from '../hooks/useRestaurants';

export default function SearchPage() {
  const { restaurants, loading, fetchRestaurants, filters, setFilters } = useRestaurants();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [filters, fetchRestaurants]);

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm, page: 1 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Search Restaurants
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Find your favorite restaurants by name, cuisine, or location
        </p>
      </div>

      <div className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by restaurant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="input flex-1"
          />
          <button onClick={handleSearch} className="btn-primary">
            Search
          </button>
        </div>
      </div>

      <SearchFilters filters={filters} setFilters={setFilters} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {restaurants.data?.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>

          {!loading && restaurants.data?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No restaurants found matching your search.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}