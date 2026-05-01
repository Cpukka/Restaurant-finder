'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import useRestaurants from '../hooks/useRestaurants';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { restaurants, loading, fetchRestaurants, deleteRestaurant } = useRestaurants();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchRestaurants();
    }
  }, [user]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Restaurants
        </h1>
        <Link href="/dashboard/add" className="btn-primary">
          Add New Restaurant
        </Link>
      </div>

      {restaurants.data?.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven't added any restaurants yet.
          </p>
          <Link href="/dashboard/add" className="btn-primary">
            Add Your First Restaurant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.data?.map((restaurant: any) => (
            <div key={restaurant.id} className="card">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {restaurant.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {restaurant.description}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/edit/${restaurant.id}`}
                    className="btn-secondary flex-1 text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure?')) {
                        deleteRestaurant(restaurant.id);
                        fetchRestaurants();
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}