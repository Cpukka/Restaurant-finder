'use client';

import { useState, useCallback } from 'react';
import axios from '../lib/axios';
import toast from 'react-hot-toast';
import { Restaurant, PaginatedResponse, Filters } from '../types';

interface UseRestaurantsReturn {
  restaurants: PaginatedResponse<Restaurant>;
  loading: boolean;
  filters: Filters;
  setFilters: (filters: Filters) => void;
  fetchRestaurants: (additionalFilters?: Filters) => Promise<void>;
  getRestaurant: (id: number) => Promise<Restaurant>;
  createRestaurant: (data: FormData) => Promise<Restaurant>;
  updateRestaurant: (id: number, data: FormData) => Promise<Restaurant>;
  deleteRestaurant: (id: number) => Promise<boolean>;
  submitReview: (restaurantId: number, rating: number, comment: string) => Promise<any>;
  fetchReviews: (restaurantId: number, page?: number) => Promise<any>;
}

export default function useRestaurants(): UseRestaurantsReturn {
  const [restaurants, setRestaurants] = useState<PaginatedResponse<Restaurant>>({
    data: [],
    current_page: 1,
    first_page_url: '',
    from: 0,
    last_page: 1,
    last_page_url: '',
    links: [],
    next_page_url: null,
    path: '',
    per_page: 15,
    prev_page_url: null,
    to: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({ page: 1 });

  const fetchRestaurants = useCallback(async (additionalFilters: Filters = {}) => {
    setLoading(true);
    try {
      const params = { ...filters, ...additionalFilters };
      const response = await axios.get('/restaurants', { params });
      setRestaurants(response.data);
    } catch (error) {
      toast.error('Failed to fetch restaurants');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const getRestaurant = async (id: number): Promise<Restaurant> => {
    try {
      const response = await axios.get(`/restaurants/${id}`);
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch restaurant details');
      throw error;
    }
  };

  const createRestaurant = async (data: FormData): Promise<Restaurant> => {
    try {
      const response = await axios.post('/restaurants', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Restaurant created successfully!');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create restaurant');
      throw error;
    }
  };

  const updateRestaurant = async (id: number, data: FormData): Promise<Restaurant> => {
    try {
      data.append('_method', 'PUT');
      const response = await axios.post(`/restaurants/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Restaurant updated successfully!');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update restaurant');
      throw error;
    }
  };

  const deleteRestaurant = async (id: number): Promise<boolean> => {
    try {
      await axios.delete(`/restaurants/${id}`);
      toast.success('Restaurant deleted successfully!');
      return true;
    } catch (error) {
      toast.error('Failed to delete restaurant');
      throw error;
    }
  };

  const submitReview = async (restaurantId: number, rating: number, comment: string): Promise<any> => {
    try {
      const response = await axios.post(`/restaurants/${restaurantId}/reviews`, { rating, comment });
      toast.success('Review submitted successfully!');
      return response.data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
      throw error;
    }
  };

  const fetchReviews = async (restaurantId: number, page: number = 1): Promise<any> => {
    try {
      const response = await axios.get(`/restaurants/${restaurantId}/reviews`, { params: { page } });
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch reviews');
      throw error;
    }
  };

  return {
    restaurants,
    loading,
    filters,
    setFilters,
    fetchRestaurants,
    getRestaurant,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    submitReview,
    fetchReviews,
  };
}