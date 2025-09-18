import { configureStore } from '@reduxjs/toolkit'
import { vehicleApi } from './services/vehicleApi'
import { bookingApi } from './services/bookingApi'

export const store = configureStore({
    reducer: {
        [vehicleApi.reducerPath]: vehicleApi.reducer,
        [bookingApi.reducerPath]: bookingApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            vehicleApi.middleware,
            bookingApi.middleware
        ),
})

// Optional: Add JSDoc comments for type hints in editors
/** @typedef {ReturnType<typeof store.getState>} RootState */
/** @typedef {typeof store.dispatch} AppDispatch */
