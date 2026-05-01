'use client';

import Link from 'next/link';
import Image from 'next/image';
import RatingStars from './RatingStars';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const averageRating = restaurant.reviews?.length
    ? restaurant.reviews.reduce((sum, review) => sum + review.rating, 0) / restaurant.reviews.length
    : 0;

  return (
    <Link href={`/restaurants/${restaurant.id}`}>
      <div className="card group cursor-pointer h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          {restaurant.image ? (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${restaurant.image}`}
              alt={restaurant.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <span className="text-white text-5xl font-bold">
                {restaurant.name.charAt(0)}
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </div>
        
        {/* Content Section */}
        <div className="p-5 flex-grow">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {restaurant.name}
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <RatingStars rating={averageRating} size="small" />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({restaurant.reviews?.length || 0} reviews)
            </span>
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {restaurant.description}
          </p>
          
          {/* Categories */}
          {restaurant.categories && restaurant.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {restaurant.categories.slice(0, 2).map((category) => (
                <span
                  key={category.id}
                  className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full"
                >
                  {category.name}
                </span>
              ))}
              {restaurant.categories.length > 2 && (
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded-full">
                  +{restaurant.categories.length - 2}
                </span>
              )}
            </div>
          )}
          
          {/* Location */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{restaurant.city}, {restaurant.address}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}