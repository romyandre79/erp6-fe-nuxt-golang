// store/nusatrip.ts
// Pinia store for NusaTrip state management

import { defineStore } from 'pinia';

interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  rating: number;
  priceFrom: number;
  currency: string;
}

interface Deal {
  id: string;
  title: string;
  type: 'flight' | 'hotel' | 'package';
  discount: number;
  originalPrice: number;
  discountedPrice: number;
  image: string;
  expiresAt: string;
}

interface NusaTripUser {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface CartItem {
  id: string;
  type: 'flight' | 'hotel' | 'experience' | 'rental' | 'package';
  name: string;
  price: number;
  details: Record<string, any>;
}

interface Booking {
  id: string;
  type: 'flight' | 'hotel' | 'experience' | 'rental' | 'package';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  details: Record<string, any>;
  createdAt: string;
  totalPrice: number;
}

interface NusaTripState {
  // User
  user: NusaTripUser | null;
  isAuthenticated: boolean;
  
  // Data
  destinations: Destination[];
  deals: Deal[];
  
  // Search Results
  flightResults: any[];
  hotelResults: any[];
  experienceResults: any[];
  rentalResults: any[];
  packageResults: any[];
  
  // User Data
  bookings: Booking[];
  cart: CartItem[];
  
  // UI State
  isLoading: boolean;
  searchTab: 'flights' | 'hotels' | 'experiences' | 'rentals' | 'packages';
}

export const useNusaTripStore = defineStore('nusatrip', {
  state: (): NusaTripState => ({
    user: null,
    isAuthenticated: false,
    destinations: [],
    deals: [],
    flightResults: [],
    hotelResults: [],
    experienceResults: [],
    rentalResults: [],
    packageResults: [],
    bookings: [],
    cart: [],
    isLoading: false,
    searchTab: 'flights',
  }),

  getters: {
    cartTotal: (state) => state.cart.reduce((sum, item) => sum + item.price, 0),
    cartCount: (state) => state.cart.length,
    activeBookings: (state) => state.bookings.filter(b => b.status === 'confirmed'),
    pendingBookings: (state) => state.bookings.filter(b => b.status === 'pending'),
  },

  actions: {
    // User Actions
    setUser(user: NusaTripUser | null) {
      this.user = user;
      this.isAuthenticated = !!user;
    },

    logout() {
      this.user = null;
      this.isAuthenticated = false;
      this.bookings = [];
      this.cart = [];
    },

    // Data Actions
    setDestinations(destinations: Destination[]) {
      this.destinations = destinations;
    },

    setDeals(deals: Deal[]) {
      this.deals = deals;
    },

    // Search Results
    setFlightResults(results: any[]) {
      this.flightResults = results;
    },

    setHotelResults(results: any[]) {
      this.hotelResults = results;
    },

    setExperienceResults(results: any[]) {
      this.experienceResults = results;
    },

    setRentalResults(results: any[]) {
      this.rentalResults = results;
    },

    setPackageResults(results: any[]) {
      this.packageResults = results;
    },

    // Cart Actions
    addToCart(item: CartItem) {
      this.cart.push(item);
    },

    removeFromCart(itemId: string) {
      this.cart = this.cart.filter(item => item.id !== itemId);
    },

    clearCart() {
      this.cart = [];
    },

    // Booking Actions
    setBookings(bookings: Booking[]) {
      this.bookings = bookings;
    },

    addBooking(booking: Booking) {
      this.bookings.unshift(booking);
    },

    // UI Actions
    setLoading(loading: boolean) {
      this.isLoading = loading;
    },

    setSearchTab(tab: NusaTripState['searchTab']) {
      this.searchTab = tab;
    },
  },
});
