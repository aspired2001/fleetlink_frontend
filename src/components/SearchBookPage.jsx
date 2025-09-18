import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useFindAvailableVehiclesQuery } from '../store/services/vehicleApi'
import { useCreateBookingMutation } from '../store/services/bookingApi'
import { useToast } from './ui/toast'
import { Search, Loader2, Truck, Calendar, MapPin, Clock, Weight, BombIcon } from 'lucide-react'
import { formatISODateTime, isValidPincode, calculateEstimatedDuration } from '../lib/utils'

const SearchBookPage = () => {
    const [searchCriteria, setSearchCriteria] = useState({
        capacityRequired: '',
        fromPincode: '',
        toPincode: '',
        startTime: ''
    })

    const [errors, setErrors] = useState({})
    const [hasSearched, setHasSearched] = useState(false)
    const [customerId] = useState('CUSTOMER-001') // Hardcoded for demo

    const { addToast } = useToast()
    const [createBooking] = useCreateBookingMutation()

    // Build query parameters for availability search
    const queryParams = hasSearched ? {
        capacityRequired: parseInt(searchCriteria.capacityRequired),
        fromPincode: searchCriteria.fromPincode,
        toPincode: searchCriteria.toPincode,
        startTime: searchCriteria.startTime
    } : null

    const {
        data: availableVehicles = [],
        isLoading: isSearching,
        error: searchError,
    } = useFindAvailableVehiclesQuery(queryParams, {
        skip: !queryParams
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setSearchCriteria(prev => ({
            ...prev,
            [name]: value
        }))

        // Clear errors when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }))
        }
    }

    const validateSearchForm = () => {
        const newErrors = {}

        const capacity = parseInt(searchCriteria.capacityRequired)
        if (!searchCriteria.capacityRequired || isNaN(capacity) || capacity < 1) {
            newErrors.capacityRequired = 'Valid capacity is required'
        }

        if (!isValidPincode(searchCriteria.fromPincode)) {
            newErrors.fromPincode = 'From pincode must be exactly 6 digits'
        }

        if (!isValidPincode(searchCriteria.toPincode)) {
            newErrors.toPincode = 'To pincode must be exactly 6 digits'
        }

        if (searchCriteria.fromPincode === searchCriteria.toPincode) {
            newErrors.toPincode = 'Destination must be different from source'
        }

        if (!searchCriteria.startTime) {
            newErrors.startTime = 'Start time is required'
        } else {
            const startTime = new Date(searchCriteria.startTime)
            const now = new Date()
            if (startTime <= now) {
                newErrors.startTime = 'Start time must be in the future'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSearch = (e) => {
        e.preventDefault()

        if (validateSearchForm()) {
            setHasSearched(true)
        }
    }

    const handleBookVehicle = async (vehicle) => {
        try {
            const bookingData = {
                vehicleId: vehicle._id,
                customerId,
                fromPincode: searchCriteria.fromPincode,
                toPincode: searchCriteria.toPincode,
                startTime: searchCriteria.startTime
            }

            const result = await createBooking(bookingData).unwrap()

            addToast({
                variant: 'success',
                title: 'Booking Confirmed!',
                description: `Vehicle ${vehicle.name} has been booked successfully`
            })

            // Refresh search results
            setHasSearched(true)

        } catch (error) {
            let errorMessage = 'Failed to create booking'

            if (error.status === 409) {
                errorMessage = 'Vehicle became unavailable. Please search again.'
            } else if (error.data?.message) {
                errorMessage = error.data.message
            }

            addToast({
                variant: 'error',
                title: 'Booking Failed',
                description: errorMessage
            })
        }
    }

    const getVehicleTypeColor = (type) => {
        switch (type) {
            case 'Light Vehicle':
                return 'text-green-600'
            case 'Medium Vehicle':
                return 'text-yellow-600'
            case 'Heavy Vehicle':
                return 'text-red-600'
            default:
                return 'text-gray-600'
        }
    }

    return (
        <div className="space-y-6">
            {/* Search Form */}
            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Search className="h-6 w-6 text-primary" />
                        <CardTitle>Search Available Vehicles</CardTitle>
                    </div>
                    <CardDescription>
                        Find vehicles that match your capacity and route requirements
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="capacityRequired">Capacity Required (KG) *</Label>
                                <Input
                                    id="capacityRequired"
                                    name="capacityRequired"
                                    type="number"
                                    min="1"
                                    placeholder="e.g., 500"
                                    value={searchCriteria.capacityRequired}
                                    onChange={handleInputChange}
                                    className={errors.capacityRequired ? 'border-red-500' : ''}
                                />
                                {errors.capacityRequired && (
                                    <p className="text-sm text-red-500">{errors.capacityRequired}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Date & Time *</Label>
                                <Input
                                    id="startTime"
                                    name="startTime"
                                    type="datetime-local"
                                    min={formatISODateTime(new Date(Date.now() + 60000))} // 1 minute from now
                                    value={searchCriteria.startTime}
                                    onChange={handleInputChange}
                                    className={errors.startTime ? 'border-red-500' : ''}
                                />
                                {errors.startTime && (
                                    <p className="text-sm text-red-500">{errors.startTime}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fromPincode">From Pincode *</Label>
                                <Input
                                    id="fromPincode"
                                    name="fromPincode"
                                    type="text"
                                    placeholder="e.g., 400001"
                                    maxLength="6"
                                    value={searchCriteria.fromPincode}
                                    onChange={handleInputChange}
                                    className={errors.fromPincode ? 'border-red-500' : ''}
                                />
                                {errors.fromPincode && (
                                    <p className="text-sm text-red-500">{errors.fromPincode}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="toPincode">To Pincode *</Label>
                                <Input
                                    id="toPincode"
                                    name="toPincode"
                                    type="text"
                                    placeholder="e.g., 400070"
                                    maxLength="6"
                                    value={searchCriteria.toPincode}
                                    onChange={handleInputChange}
                                    className={errors.toPincode ? 'border-red-500' : ''}
                                />
                                {errors.toPincode && (
                                    <p className="text-sm text-red-500">{errors.toPincode}</p>
                                )}
                            </div>
                        </div>

                        {/* Estimated Duration Preview */}
                        {searchCriteria.fromPincode &&
                            searchCriteria.toPincode &&
                            isValidPincode(searchCriteria.fromPincode) &&
                            isValidPincode(searchCriteria.toPincode) && (
                                <div className="p-3 bg-muted rounded-lg">
                                    <p className="text-sm text-muted-foreground">
                                        Estimated ride duration: <span className="font-medium">
                                            {calculateEstimatedDuration(searchCriteria.fromPincode, searchCriteria.toPincode)} hours
                                        </span>
                                    </p>
                                </div>
                            )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSearching}
                        >
                            {isSearching ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Searching...
                                </>
                            ) : (
                                <>
                                    <Search className="mr-2 h-4 w-4" />
                                    Search Available Vehicles
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Search Results */}
            {hasSearched && (
                <Card>
                    <CardHeader>
                        <CardTitle>Search Results</CardTitle>
                        <CardDescription>
                            {isSearching ? 'Searching for available vehicles...' :
                                `Found ${availableVehicles.length} available vehicle${availableVehicles.length !== 1 ? 's' : ''}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {searchError && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800">
                                    Error: {searchError.data?.message || 'Failed to search vehicles'}
                                </p>
                            </div>
                        )}

                        {!isSearching && !searchError && availableVehicles.length === 0 && (
                            <div className="text-center py-8">
                                <Truck className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                    No vehicles available
                                </h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search criteria or selecting a different time slot.
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {availableVehicles.map((vehicle) => (
                                <div key={vehicle._id} className="border rounded-lg p-4 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <h3 className="text-lg font-semibold flex items-center">
                                                <Truck className="mr-2 h-5 w-5" />
                                                {vehicle.name}
                                            </h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center text-muted-foreground">
                                                    <Weight className="mr-1 h-4 w-4" />
                                                    <span>{vehicle.capacityKg} KG</span>
                                                </div>
                                                <div className="flex items-center text-muted-foreground">
                                                    <BombIcon className="mr-1 h-4 w-4" />
                                                    <span>{vehicle.tyres} Tyres</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className={`font-medium ${getVehicleTypeColor(vehicle.type)}`}>
                                                        {vehicle.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-muted-foreground">
                                                    <Clock className="mr-1 h-4 w-4" />
                                                    <span>{vehicle.estimatedRideDurationHours}h duration</span>
                                                </div>
                                            </div>

                                            {vehicle.routeInfo && (
                                                <div className="flex items-center text-sm text-muted-foreground">
                                                    <MapPin className="mr-1 h-4 w-4" />
                                                    <span>
                                                        {vehicle.routeInfo.route} •
                                                        ~{vehicle.routeInfo.estimatedDistanceKm} km •
                                                        ₹{vehicle.routeInfo.estimatedCost}
                                                    </span>
                                                </div>
                                            )}

                                            {vehicle.registrationNumber && (
                                                <p className="text-sm text-muted-foreground">
                                                    Registration: {vehicle.registrationNumber}
                                                </p>
                                            )}
                                        </div>

                                        <Button
                                            onClick={() => handleBookVehicle(vehicle)}
                                            className="shrink-0"
                                        >
                                            <Calendar className="mr-2 h-4 w-4" />
                                            Book Now
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default SearchBookPage