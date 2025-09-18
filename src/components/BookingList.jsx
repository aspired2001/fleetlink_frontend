import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useGetAllBookingsQuery, useCancelBookingMutation } from '../store/services/bookingApi'
import { useToast } from './ui/toast'
import { Calendar, Filter, X, AlertCircle, MapPin, Clock, Truck, User } from 'lucide-react'
import { formatDateTime } from '../lib/utils'

const BookingList = () => {
    const [filters, setFilters] = useState({
        status: '',
        customerId: '',
        startDate: '',
        endDate: ''
    })

    const { addToast } = useToast()
    const [cancelBooking] = useCancelBookingMutation()

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

    const handleCancelBooking = async (booking) => {
        const reason = prompt('Please provide a reason for cancellation (optional):')
        if (reason === null) return // User clicked cancel

        try {
            await cancelBooking({ id: booking._id, reason }).unwrap()
            addToast({
                variant: 'success',
                title: 'Booking Cancelled',
                description: `Booking for ${booking.vehicleId?.name} has been cancelled`
            })
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
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading bookings...</p>
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
                        <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600">Failed to load bookings</p>
                        <p className="text-sm text-muted-foreground">{error.data?.message || error.message}</p>
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
                        <Filter className="h-5 w-5 text-primary" />
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
                                className="w-full h-10 px-3 py-2 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
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
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                No bookings found
                            </h3>
                            <p className="text-muted-foreground">
                                {Object.values(filters).some(f => f)
                                    ? 'Try adjusting your filters.'
                                    : 'No bookings have been made yet.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bookings.map((booking) => (
                                <div key={booking._id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold flex items-center">
                                                    <Calendar className="mr-2 h-5 w-5" />
                                                    Booking #{booking._id.slice(-8)}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center text-muted-foreground">
                                                    <Truck className="mr-1 h-4 w-4" />
                                                    <span>{booking.vehicleId?.name || 'Unknown Vehicle'}</span>
                                                </div>
                                                <div className="flex items-center text-muted-foreground">
                                                    <User className="mr-1 h-4 w-4" />
                                                    <span>{booking.customerId}</span>
                                                </div>
                                                <div className="flex items-center text-muted-foreground">
                                                    <MapPin className="mr-1 h-4 w-4" />
                                                    <span>{booking.fromPincode} → {booking.toPincode}</span>
                                                </div>
                                                <div className="flex items-center text-muted-foreground">
                                                    <Clock className="mr-1 h-4 w-4" />
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
                                                <p className="text-sm text-muted-foreground">
                                                    <span className="font-medium">Notes:</span> {booking.notes}
                                                </p>
                                            )}

                                            {booking.vehicleId && (
                                                <div className="text-sm text-muted-foreground">
                                                    <span className="font-medium">Vehicle Details:</span>
                                                    {booking.vehicleId.capacityKg} KG • {booking.vehicleId.tyres} Tyres
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            {canCancelBooking(booking) && (
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleCancelBooking(booking)}
                                                >
                                                    <X className="h-4 w-4" />
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default BookingList