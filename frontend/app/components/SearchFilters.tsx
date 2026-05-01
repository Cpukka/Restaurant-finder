'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { Filters } from '../types';

const CITIES = ['All Cities', 'Abuja', 'Lagos', 'Port Harcourt', 'Kano', 'Ibadan'];
const CATEGORIES = [
  'All Categories',
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

interface SearchFiltersProps {
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

export default function SearchFilters({ filters, setFilters }: SearchFiltersProps) {
  const [localSearch, setLocalSearch] = useState(filters.search || '');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [radius, setRadius] = useState(filters.radius || 10);
  const [useLocation, setUseLocation] = useState(false);

  const handleSearch = () => {
    setFilters({ ...filters, search: localSearch, page: 1 });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleLocationSearch = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFilters({
            ...filters,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radius: radius,
            page: 1,
          });
          setUseLocation(true);
        },
        (error) => {
          alert('Unable to get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const clearFilters = () => {
    setFilters({ page: 1 });
    setLocalSearch('');
    setUseLocation(false);
    setRadius(10);
  };

  return (
    <div className="space-y-4 w-full">
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search restaurants by name or cuisine..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            className="input pl-11 pr-4 py-3"
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        
        <div className="flex gap-2">
          <button onClick={handleSearch} className="btn-primary px-6">
            Search
          </button>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="btn-secondary px-4"
            title="Advanced Filters"
          >
            <FunnelIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* City Filter */}
            <div>
              <label className="label">City</label>
              <select
                value={filters.city || 'All Cities'}
                onChange={(e) => setFilters({ ...filters, city: e.target.value === 'All Cities' ? '' : e.target.value, page: 1 })}
                className="input"
              >
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="label">Cuisine Type</label>
              <select
                value={filters.category || 'All Categories'}
                onChange={(e) => setFilters({ ...filters, category: e.target.value === 'All Categories' ? '' : e.target.value, page: 1 })}
                className="input"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Location-based Search */}
            <div>
              <label className="label">Search by Location</label>
              <div className="flex gap-2">
                <button
                  onClick={handleLocationSearch}
                  className="btn-secondary flex-1"
                >
                  Use My Location
                </button>
              </div>
            </div>

            {/* Radius Filter */}
            {useLocation && (
              <div>
                <label className="label">Radius (km)</label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  onMouseUp={() => {
                    if (useLocation && filters.latitude && filters.longitude) {
                      setFilters({ ...filters, radius, page: 1 });
                    }
                  }}
                  className="w-full"
                />
                <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {radius} km
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {(filters.search || filters.city || filters.category || useLocation) && (
            <div className="mt-4 text-right">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {(filters.search || filters.city || filters.category || useLocation) && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
              Search: {filters.search}
              <button onClick={() => setFilters({ ...filters, search: '', page: 1 })} className="hover:text-primary-900">
                ×
              </button>
            </span>
          )}
          {filters.city && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
              City: {filters.city}
              <button onClick={() => setFilters({ ...filters, city: '', page: 1 })} className="hover:text-primary-900">
                ×
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
              Category: {filters.category}
              <button onClick={() => setFilters({ ...filters, category: '', page: 1 })} className="hover:text-primary-900">
                ×
              </button>
            </span>
          )}
          {useLocation && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full">
              Within {radius} km
              <button onClick={() => {
                setUseLocation(false);
                setFilters({ ...filters, latitude: undefined, longitude: undefined, radius: undefined, page: 1 });
              }} className="hover:text-green-900">
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}