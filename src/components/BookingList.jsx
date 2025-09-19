import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './CustomDialog'
import { useGetAllBookingsQuery, useCancelBookingMutation } from '../store/services/bookingApi'
import { useToast } from './ui/toast'
import { formatDateTime } from '../lib/utils'

// Custom Icons (SVG components)
const CalendarIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
    </svg>
)

const FilterIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
    </svg>
)

const XIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
)

const AlertCircleIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const MapPinIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
)

const ClockIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const TruckIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
    </svg>
)

const UserIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
)

const AlertTriangleIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
)

const BookingList = () => {
    const [filters, setFilters] = useState({
        status: '',
        customerId: '',
        startDate: '',
        endDate: ''
    })

    const [cancelDialog, setCancelDialog] = useState({
        open: false,
        booking: null,
        reason: ''
    })

    const { addToast } = useToast()
    const [cancelBooking, { isLoading: isCancelling }] = useCancelBookingMutation()

    const {
        data: bookings = [],
        isLoading,
        error
    } = useGetAllBookingsQuery(filters)

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const openCancelDialog = (booking) => {
        setCancelDialog({
            open: true,
            booking,
            reason: ''
        })
    }

    const closeCancelDialog = () => {
        setCancelDialog({
            open: false,
            booking: null,
            reason: ''
        })
    }

    const handleReasonChange = (e) => {
        setCancelDialog(prev => ({
            ...prev,
            reason: e.target.value
        }))
    }

    const handleConfirmCancel = async () => {
        if (!cancelDialog.booking) return

        try {
            await cancelBooking({
                id: cancelDialog.booking._id,
                reason: cancelDialog.reason || 'No reason provided'
            }).unwrap()

            addToast({
                variant: 'success',
                title: 'Booking Cancelled',
                description: `Booking for ${cancelDialog.booking.vehicleId?.name || 'vehicle'} has been cancelled`
            })
            closeCancelDialog()
        } catch (error) {
            addToast({
                variant: 'error',
                title: 'Cancellation Failed',
                description: error.data?.message || 'Failed to cancel booking'
            })
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'in-progress':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
        }
    }

    const canCancelBooking = (booking) => {
        if (booking.status === 'completed' || booking.status === 'cancelled') {
            return false
        }

        const now = new Date()
        const startTime = new Date(booking.startTime)
        const timeDiff = startTime.getTime() - now.getTime()
        const hoursDiff = timeDiff / (1000 * 60 * 60)

        return hoursDiff > 2 // Can cancel if more than 2 hours before start time
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading bookings...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <AlertCircleIcon className="h-8 w-8 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600">Failed to load bookings</p>
                        <p className="text-sm text-gray-600">{error.data?.message || error.message}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Filters */}
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <FilterIcon className="h-5 w-5 text-blue-600" />
                        <CardTitle className="text-lg">Filters</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full h-10 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All Statuses</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customerId">Customer ID</Label>
                            <Input
                                id="customerId"
                                name="customerId"
                                type="text"
                                placeholder="e.g., CUSTOMER-001"
                                value={filters.customerId}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="startDate">From Date</Label>
                            <Input
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="endDate">To Date</Label>
                            <Input
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Booking List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Bookings</CardTitle>
                    <CardDescription>
                        {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {bookings.length === 0 ? (
                        <div className="text-center py-8">
                            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                                No bookings found
                            </h3>
                            <p className="text-gray-600">
                                {Object.values(filters).some(f => f)
                                    ? 'Try adjusting your filters.'
                                    : 'No bookings have been made yet.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold flex items-center">
                                                    <CalendarIcon className="mr-2 h-5 w-5" />
                                                    Booking #{booking._id.slice(-8)}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center text-gray-600">
                                                    <TruckIcon className="mr-1 h-4 w-4" />
                                                    <span>{booking.vehicleId?.name || 'Unknown Vehicle'}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <UserIcon className="mr-1 h-4 w-4" />
                                                    <span>{booking.customerId}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <MapPinIcon className="mr-1 h-4 w-4" />
                                                    <span>{booking.fromPincode} → {booking.toPincode}</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <ClockIcon className="mr-1 h-4 w-4" />
                                                    <span>{booking.estimatedRideDurationHours}h duration</span>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-sm">
                                                    <span className="font-medium">Start:</span> {formatDateTime(booking.startTime)}
                                                </p>
                                                <p className="text-sm">
                                                    <span className="font-medium">End:</span> {formatDateTime(booking.endTime)}
                                                </p>
                                                {booking.actualStartTime && (
                                                    <p className="text-sm text-green-600">
                                                        <span className="font-medium">Actual Start:</span> {formatDateTime(booking.actualStartTime)}
                                                    </p>
                                                )}
                                                {booking.actualEndTime && (
                                                    <p className="text-sm text-green-600">
                                                        <span className="font-medium">Actual End:</span> {formatDateTime(booking.actualEndTime)}
                                                    </p>
                                                )}
                                            </div>

                                            {booking.notes && (
                                                <p className="text-sm text-gray-600">
                                                    <span className="font-medium">Notes:</span> {booking.notes}
                                                </p>
                                            )}

                                            {booking.vehicleId && (
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium">Vehicle Details:</span>
                                                    {booking.vehicleId.capacityKg} KG • {booking.vehicleId.tyres} Tyres
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            {canCancelBooking(booking) && (
                                                <button
                                                    onClick={() => openCancelDialog(booking)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-1"
                                                >
                                                    <XIcon className="h-4 w-4" />
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Cancel Booking Dialog */}
            <Dialog open={cancelDialog.open} onClose={closeCancelDialog}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangleIcon className="h-5 w-5" />
                        Cancel Booking
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to cancel this booking? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {cancelDialog.booking && (
                    <DialogContent className="py-4">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-4">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="h-4 w-4 text-gray-600" />
                                <span className="font-semibold">
                                    Booking #{cancelDialog.booking._id.slice(-8)}
                                </span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>Vehicle: {cancelDialog.booking.vehicleId?.name || 'Unknown Vehicle'}</div>
                                <div>Customer: {cancelDialog.booking.customerId}</div>
                                <div>Route: {cancelDialog.booking.fromPincode} → {cancelDialog.booking.toPincode}</div>
                                <div>Start Time: {formatDateTime(cancelDialog.booking.startTime)}</div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="cancelReason">Reason for Cancellation (Optional)</Label>
                            <textarea
                                id="cancelReason"
                                value={cancelDialog.reason}
                                onChange={handleReasonChange}
                                placeholder="Enter the reason for cancelling this booking..."
                                className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                            />
                        </div>
                    </DialogContent>
                )}

                <DialogFooter>
                    <button
                        onClick={closeCancelDialog}
                        disabled={isCancelling}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Keep Booking
                    </button>
                    <button
                        onClick={handleConfirmCancel}
                        disabled={isCancelling}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isCancelling ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Cancelling...
                            </>
                        ) : (
                            <>
                                <XIcon className="h-4 w-4 mr-2" />
                                Cancel Booking
                            </>
                        )}
                    </button>
                </DialogFooter>
            </Dialog>
        </div>
    )
}

export default BookingList