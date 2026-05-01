# 🍽️ Restaurant Finder

A full-stack web application for discovering, reviewing, and managing restaurants. Built with Laravel 11 (backend API) and Next.js 14 (frontend).

[![Laravel Version](https://img.shields.io/badge/Laravel-11-red.svg)](https://laravel.com)
[![Next.js Version](https://img.shields.io/badge/Next.js-14-black.svg)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with Laravel Sanctum
- Role-based access control (Admin, Vendor, User)
- Protected routes with token-based authentication

### 🏪 Restaurant Management
- Vendors can create, update, and delete restaurants
- Upload restaurant images
- Assign multiple categories to restaurants
- Set location coordinates for map integration

### 🔍 Search & Discovery
- Advanced search with multiple filters
- Search by name, cuisine, city, or category
- Distance-based search using Haversine formula
- Autocomplete suggestions for search
- Sort by rating, name, or newest

### ⭐ Reviews & Ratings
- Users can leave reviews and ratings (1-5 stars)
- View average ratings for each restaurant
- See detailed review history with user info
- Prevent duplicate reviews from same user

### 🗺️ Map Integration
- Interactive map showing restaurant locations
- Markers with popup information
- Click-to-navigate directions
- Get user's current location for nearby searches

### 🎨 User Interface
- Fully responsive design (mobile, tablet, desktop)
- Dark mode support with theme toggle
- Beautiful gradient UI with smooth animations
- Restaurant cards with images and quick info
- Loading states and error handling

### 📊 Dashboard
- Vendor dashboard to manage restaurants
- View, edit, and delete own restaurants
- Analytics dashboard (optional)
- Review management

## 🏗️ Tech Stack

### Backend
- **Framework**: Laravel 11
- **Database**: PostgreSQL / MySQL
- **Authentication**: Laravel Sanctum
- **API**: RESTful with resource controllers
- **Validation**: Form Requests
- **Architecture**: Service Layer pattern

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4
- **State Management**: Context API + Zustand
- **HTTP Client**: Axios
- **Maps**: Leaflet with React-Leaflet
- **Icons**: Heroicons, React Icons
- **Notifications**: React Hot Toast

### Development Tools
- **Development Environment**: Laragon (Windows)
- **Version Control**: Git
- **Package Manager**: Composer (PHP), NPM (Node)

## 📁 Project Structure
