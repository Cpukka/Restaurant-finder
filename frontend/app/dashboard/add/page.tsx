'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import useRestaurants from '../../hooks/useRestaurants';
import Image from 'next/image';
import toast from 'react-hot-toast';

// Categories data
const CATEGORIES = [
  { id: 1, name: 'Fast Food' },
  { id: 2, name: 'Nigerian' },
  { id: 3, name: 'Chinese' },
  { id: 4, name: 'Italian' },
  { id: 5, name: 'Seafood' },
  { id: 6, name: 'Vegetarian' },
  { id: 7, name: 'Grill' },
  { id: 8, name: 'Bakery' },
  { id: 9, name: 'Coffee Shop' },
  { id: 10, name: 'Fine Dining' },
];

// Nigerian cities
const CITIES = [
  'Abuja',
  'Lagos',
  'Port Harcourt',
  'Kano',
  'Ibadan',
  'Benin City',
  'Enugu',
  'Jos',
  'Kaduna',
  'Warri'
];

interface FormData {
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: string;
  longitude: string;
  categories: number[];
  image: File | null;
}

interface FormErrors {
  name?: string;
  description?: string;
  address?: string;
  city?: string;
  latitude?: string;
  longitude?: string;
  categories?: string;
  image?: string;
  general?: string;
}

export default function AddRestaurantPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { createRestaurant } = useRestaurants();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    address: '',
    city: '',
    latitude: '',
    longitude: '',
    categories: [],
    image: null,
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Redirect if not vendor or admin
  useEffect(() => {
    if (!authLoading && user) {
      if (user.role !== 'vendor' && user.role !== 'admin') {
        toast.error('You do not have permission to add restaurants');
        router.push('/');
      }
    }
  }, [user, authLoading, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Restaurant name is required';
    } else if (formData.name.length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'Please select a city';
    }
    
    if (!formData.latitude) {
      newErrors.latitude = 'Latitude is required';
    } else {
      const lat = parseFloat(formData.latitude);
      if (isNaN(lat) || lat < -90 || lat > 90) {
        newErrors.latitude = 'Invalid latitude (must be between -90 and 90)';
      }
    }
    
    if (!formData.longitude) {
      newErrors.longitude = 'Longitude is required';
    } else {
      const lng = parseFloat(formData.longitude);
      if (isNaN(lng) || lng < -180 || lng > 180) {
        newErrors.longitude = 'Invalid longitude (must be between -180 and 180)';
      }
    }
    
    if (formData.categories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleCategoryToggle = (categoryId: number) => {
    setFormData(prev => {
      const categories = prev.categories.includes(categoryId)
        ? prev.categories.filter(id => id !== categoryId)
        : [...prev.categories, categoryId];
      return { ...prev, categories };
    });
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: undefined }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPEG, PNG, or WEBP)');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image size must be less than 2MB');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      setIsGettingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString(),
        }));
        setIsGettingLocation(false);
        toast.success('Location detected successfully!');
      },
      (error) => {
        setIsGettingLocation(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Please enable location access to use this feature');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information is unavailable');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out');
            break;
          default:
            toast.error('Failed to get location');
        }
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      submitData.append('name', formData.name.trim());
      submitData.append('description', formData.description.trim());
      submitData.append('address', formData.address.trim());
      submitData.append('city', formData.city);
      submitData.append('latitude', formData.latitude);
      submitData.append('longitude', formData.longitude);
      
      formData.categories.forEach(catId => {
        submitData.append('categories[]', catId.toString());
      });
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }
      
      await createRestaurant(submitData);
      toast.success('Restaurant created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Error creating restaurant:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create restaurant';
      setErrors(prev => ({ ...prev, general: errorMessage }));
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Check permission
  if (user && user.role !== 'vendor' && user.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Add New Restaurant
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Fill in the details below to add your restaurant to our platform
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Error */}
        {errors.general && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-600 dark:text-red-400">{errors.general}</p>
          </div>
        )}

        {/* Restaurant Name */}
        <div>
          <label htmlFor="name" className="label">
            Restaurant Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`input ${errors.name ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="e.g., The Nile Restaurant"
            maxLength={100}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="label">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={5}
            className={`input ${errors.description ? 'border-red-500 focus:ring-red-500' : ''}`}
            placeholder="Describe your restaurant, cuisine, ambiance, specialties..."
            maxLength={1000}
          />
          <div className="flex justify-between mt-1">
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
            <p className="text-sm text-gray-500">
              {formData.description.length}/1000 characters
            </p>
          </div>
        </div>

        {/* Address and City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="address" className="label">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`input ${errors.address ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="Street address"
            />
            {errors.address && (
              <p className="mt-1 text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div>
            <label htmlFor="city" className="label">
              City <span className="text-red-500">*</span>
            </label>
            <select
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`input ${errors.city ? 'border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="">Select a city</option>
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            {errors.city && (
              <p className="mt-1 text-sm text-red-500">{errors.city}</p>
            )}
          </div>
        </div>

        {/* Location Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="latitude" className="label">
              Latitude <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="any"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              className={`input ${errors.latitude ? 'border-red-500 focus:ring-red-500' : ''}`}
              placeholder="e.g., 9.0765"
            />
            {errors.latitude && (
              <p className="mt-1 text-sm text-red-500">{errors.latitude}</p>
            )}
          </div>

          <div>
            <label htmlFor="longitude" className="label">
              Longitude <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="any"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                className={`input flex-1 ${errors.longitude ? 'border-red-500 focus:ring-red-500' : ''}`}
                placeholder="e.g., 7.3986"
              />
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
                className="btn-secondary whitespace-nowrap"
              >
                {isGettingLocation ? 'Getting...' : 'Use My Location'}
              </button>
            </div>
            {errors.longitude && (
              <p className="mt-1 text-sm text-red-500">{errors.longitude}</p>
            )}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="label mb-2">
            Categories <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryToggle(category.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  formData.categories.includes(category.id)
                    ? 'bg-primary-600 text-white shadow-md scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          {errors.categories && (
            <p className="mt-2 text-sm text-red-500">{errors.categories}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Select one or more categories that best describe your restaurant
          </p>
        </div>

        {/* Restaurant Image */}
        <div>
          <label className="label">Restaurant Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-primary-500 transition-colors">
            <div className="space-y-1 text-center">
              {imagePreview ? (
                <div className="mb-4">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="mx-auto rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: null }));
                      setImagePreview(null);
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-700"
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <>
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label
                      htmlFor="image-upload"
                      className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image-upload"
                        name="image-upload"
                        type="file"
                        className="sr-only"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, WEBP up to 2MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Creating...</span>
              </div>
            ) : (
              'Create Restaurant'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}