import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './CustomDialog'
import { useGetAllVehiclesQuery, useDeleteVehicleMutation } from '../store/services/vehicleApi'
import { useToast } from './ui/toast'
import { formatDateTime } from '../lib/utils'

// Custom Icons (SVG components to replace lucide-react)
const TruckIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z" />
    </svg>
)

const FilterIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
    </svg>
)

const Trash2Icon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
)

const AlertCircleIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
)

const WeightIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
)

const CircleIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" strokeWidth={2} />
    </svg>
)

const CalendarIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
)

const AlertTriangleIcon = ({ className = '' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
    </svg>
)

const VehicleList = () => {
    const [filters, setFilters] = useState({
        status: '',
        minCapacity: ''
    })

    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        vehicle: null
    })

    const { addToast } = useToast()
    const [deleteVehicle, { isLoading: isDeleting }] = useDeleteVehicleMutation()

    const {
        data: vehicles = [],
        isLoading,
        error
    } = useGetAllVehiclesQuery(filters)

    const handleFilterChange = (e) => {
        const { name, value } = e.target
        setFilters(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const openDeleteDialog = (vehicle) => {
        setDeleteDialog({
            open: true,
            vehicle
        })
    }

    const closeDeleteDialog = () => {
        setDeleteDialog({
            open: false,
            vehicle: null
        })
    }

    const handleConfirmDelete = async () => {
        if (!deleteDialog.vehicle) return

        try {
            await deleteVehicle(deleteDialog.vehicle._id).unwrap()
            addToast({
                variant: 'success',
                title: 'Vehicle Deleted',
                description: `${deleteDialog.vehicle.name} has been removed from the fleet`
            })
            closeDeleteDialog()
        } catch (error) {
            addToast({
                variant: 'error',
                title: 'Delete Failed',
                description: error.data?.message || 'Failed to delete vehicle'
            })
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200'
            case 'retired':
                return 'bg-red-100 text-red-800 border-red-200'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200'
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

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading vehicles...</p>
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
                        <p className="text-red-600">Failed to load vehicles</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                <option value="active">Active</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="retired">Retired</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="minCapacity">Minimum Capacity (KG)</Label>
                            <Input
                                id="minCapacity"
                                name="minCapacity"
                                type="number"
                                min="1"
                                placeholder="e.g., 1000"
                                value={filters.minCapacity}
                                onChange={handleFilterChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Vehicle List */}
            <Card>
                <CardHeader>
                    <CardTitle>Fleet Overview</CardTitle>
                    <CardDescription>
                        {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} in your fleet
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {vehicles.length === 0 ? (
                        <div className="text-center py-8">
                            <TruckIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-600 mb-2">
                                No vehicles found
                            </h3>
                            <p className="text-gray-600">
                                {Object.values(filters).some(f => f)
                                    ? 'Try adjusting your filters or add some vehicles to get started.'
                                    : 'Add your first vehicle to get started.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {vehicles.map((vehicle) => (
                                <div key={vehicle._id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-3 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold flex items-center">
                                                    <TruckIcon className="mr-2 h-5 w-5" />
                                                    {vehicle.name}
                                                </h3>
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(vehicle.status)}`}>
                                                    {vehicle.status}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                                <div className="flex items-center text-gray-600">
                                                    <WeightIcon className="mr-1 h-4 w-4" />
                                                    <span>{vehicle.capacityKg} KG</span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <CircleIcon className="mr-1 h-4 w-4" />
                                                    <span>{vehicle.tyres} Tyres</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <span className={`font-medium ${getVehicleTypeColor(vehicle.type)}`}>
                                                        {vehicle.type}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-gray-600">
                                                    <CalendarIcon className="mr-1 h-4 w-4" />
                                                    <span>{formatDateTime(vehicle.createdAt)}</span>
                                                </div>
                                            </div>

                                            {vehicle.registrationNumber && (
                                                <p className="text-sm text-gray-600">
                                                    Registration: {vehicle.registrationNumber}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2 ml-4">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => openDeleteDialog(vehicle)}
                                                disabled={vehicle.status === 'retired'}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Trash2Icon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onClose={closeDeleteDialog}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangleIcon className="h-5 w-5" />
                        Confirm Vehicle Deletion
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        This action cannot be undone. The vehicle will be permanently removed from your fleet.
                    </DialogDescription>
                </DialogHeader>

                {deleteDialog.vehicle && (
                    <DialogContent className="py-4">
                        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                            <div className="flex items-center gap-2">
                                <TruckIcon className="h-4 w-4 text-gray-600" />
                                <span className="font-semibold">{deleteDialog.vehicle.name}</span>
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>Capacity: {deleteDialog.vehicle.capacityKg} KG</div>
                                <div>Type: {deleteDialog.vehicle.type}</div>
                                {deleteDialog.vehicle.registrationNumber && (
                                    <div>Registration: {deleteDialog.vehicle.registrationNumber}</div>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                )}

                <DialogFooter>
                    <button
                        onClick={closeDeleteDialog}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                        {isDeleting ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2Icon className="h-4 w-4 mr-2" />
                                Delete Vehicle
                            </>
                        )}
                    </button>
                </DialogFooter>
            </Dialog>
        </div>
    )
}

export default VehicleList