'use client';

import { useEffect, useState } from 'react';
import RestaurantCard from './components/RestaurantCard';
import SearchFilters from './components/SearchFilters';
import MapComponent from './components/MapComponent';
import useRestaurants from './hooks/useRestaurants';

export default function HomePage() {
  const { restaurants, loading, fetchRestaurants, filters, setFilters } = useRestaurants();
  const [showMap, setShowMap] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    fetchRestaurants();
  }, [filters, fetchRestaurants]);

  useEffect(() => {
    // Get user's location if they allow
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation not enabled');
        }
      );
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent mb-4">
          Discover Amazing Restaurants
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Find the best dining spots in Abuja, Nigeria
        </p>
      </div>

      {/* Filters and Map Toggle */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <SearchFilters filters={filters} setFilters={setFilters} />
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn-secondary flex items-center gap-2"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>
        </div>

        {/* Map Component */}
        {showMap && (
          <div className="mb-8 h-96 rounded-xl overflow-hidden shadow-lg animate-slide-up">
            <MapComponent 
              restaurants={restaurants.data} 
              center={userLocation ? [userLocation.lat, userLocation.lng] : [9.0765, 7.3986]}
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 bg-primary-100 dark:bg-primary-900 rounded-full"></div>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.data.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && restaurants.data.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* Pagination */}
        {restaurants.links && restaurants.links.length > 3 && (
          <div className="flex justify-center mt-8 space-x-2">
            {restaurants.links.map((link, index) => (
              <button
                key={index}
                onClick={() => {
                  if (link.url) {
                    const page = new URL(link.url).searchParams.get('page');
                    setFilters({ ...filters, page: parseInt(page || '1') });
                  }
                }}
                className={`px-3 py-2 rounded-lg transition-all duration-200 ${
                  link.active
                    ? 'bg-primary-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
                disabled={!link.url}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}