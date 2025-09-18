import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Use environment variable with fallback
const VEHICLE_API_BASE_URL = process.env.REACT_APP_VEHICLE_API_URL || 'http://localhost:3000/api/vehicles'

export const vehicleApi = createApi({
    reducerPath: 'vehicleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: VEHICLE_API_BASE_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json')
            return headers
        },
    }),
    tagTypes: ['Vehicle'],
    endpoints: (builder) => ({
        // Create vehicle
        createVehicle: builder.mutation({
            query: (vehicleData) => ({
                url: '/',
                method: 'POST',
                body: vehicleData,
            }),
            invalidatesTags: ['Vehicle'],
            transformResponse: (response) => response.data,
        }),

        // Get all vehicles
        getAllVehicles: builder.query({
            query: (filters = {}) => {
                const params = new URLSearchParams()
                Object.entries(filters).forEach(([key, value]) => {
                    if (value) params.append(key, value)
                })
                return `/?${params.toString()}`
            },
            providesTags: ['Vehicle'],
            transformResponse: (response) => response.data,
        }),

        // Get vehicle by ID
        getVehicleById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: 'Vehicle', id }],
            transformResponse: (response) => response.data,
        }),

        // Find available vehicles
        findAvailableVehicles: builder.query({
            query: (criteria) => {
                const params = new URLSearchParams()
                Object.entries(criteria).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        params.append(key, value)
                    }
                })
                return `/available?${params.toString()}`
            },
            transformResponse: (response) => response.data,
        }),

        // Update vehicle status
        updateVehicleStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Vehicle', id }, 'Vehicle'],
            transformResponse: (response) => response.data,
        }),

        // Get vehicle utilization
        getVehicleUtilization: builder.query({
            query: ({ id, dateRange = {} }) => {
                const params = new URLSearchParams()
                Object.entries(dateRange).forEach(([key, value]) => {
                    if (value) params.append(key, value)
                })
                return `/${id}/utilization?${params.toString()}`
            },
            providesTags: (result, error, { id }) => [{ type: 'Vehicle', id: `${id}-utilization` }],
            transformResponse: (response) => response.data,
        }),

        // Delete vehicle
        deleteVehicle: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Vehicle'],
            transformResponse: (response) => response.data,
        }),
    }),
})

export const {
    useCreateVehicleMutation,
    useGetAllVehiclesQuery,
    useGetVehicleByIdQuery,
    useFindAvailableVehiclesQuery,
    useUpdateVehicleStatusMutation,
    useGetVehicleUtilizationQuery,
    useDeleteVehicleMutation,
} = vehicleApi