import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Use environment variable with fallback
const BOOKING_API_BASE_URL = process.env.REACT_APP_BOOKING_API_URL || 'http://localhost:3000/api/bookings'

export const bookingApi = createApi({
    reducerPath: 'bookingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: BOOKING_API_BASE_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json')
            return headers
        },
    }),
    tagTypes: ['Booking'],
    endpoints: (builder) => ({
        // Create booking
        createBooking: builder.mutation({
            query: (bookingData) => ({
                url: '/',
                method: 'POST',
                body: bookingData,
            }),
            invalidatesTags: ['Booking'],
            transformResponse: (response) => response.data,
        }),

        // Get all bookings
        getAllBookings: builder.query({
            query: (filters = {}) => {
                const params = new URLSearchParams()
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) params.append(key, value)
                })
                return `/?${params.toString()}`
            },
            providesTags: ['Booking'],
            transformResponse: (response) => response.data,
        }),

        // Get booking by ID
        getBookingById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Booking', id }],
            transformResponse: (response) => response.data,
        }),

        // Update booking status
        updateBookingStatus: builder.mutation({
            query: ({ id, status, notes }) => ({
                url: `/${id}/status`,
                method: 'PATCH',
                body: { status, notes },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Booking'],
            transformResponse: (response) => response.data,
        }),

        // Cancel booking
        cancelBooking: builder.mutation({
            query: ({ id, reason }) => ({
                url: `/${id}/cancel`,
                method: 'PATCH',
                body: { reason },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Booking', id }, 'Booking'],
            transformResponse: (response) => response.data,
        }),

        // Get customer bookings
        getCustomerBookings: builder.query({
            query: ({ customerId, ...options }) => {
                const params = new URLSearchParams()
                Object.entries(options).forEach(([key, value]) => {
                    if (value !== undefined) params.append(key, value)
                })
                return `/customer/${customerId}?${params.toString()}`
            },
            providesTags: (result, error, { customerId }) => [
                { type: 'Booking', id: `customer-${customerId}` }
            ],
            transformResponse: (response) => response.data,
        }),

        // Get booking analytics
        getBookingAnalytics: builder.query({
            query: (dateRange = {}) => {
                const params = new URLSearchParams()
                Object.entries(dateRange).forEach(([key, value]) => {
                    if (value) params.append(key, value)
                })
                return `/analytics?${params.toString()}`
            },
            transformResponse: (response) => response.data,
        }),

        // Delete booking
        deleteBooking: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Booking'],
        }),
    }),
})

export const {
    useCreateBookingMutation,
    useGetAllBookingsQuery,
    useGetBookingByIdQuery,
    useUpdateBookingStatusMutation,
    useCancelBookingMutation,
    useGetCustomerBookingsQuery,
    useGetBookingAnalyticsQuery,
    useDeleteBookingMutation,
} = bookingApi